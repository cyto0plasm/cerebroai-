import os
import base64
import random
import threading
import numpy as np
import cv2
import torch
import torch.nn as nn
from torchvision import models, transforms
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import hf_hub_download

app = FastAPI(title="CerebroAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_MODEL_REPO = "cyto0plasm/MRI_IMAGING_TOMUR_DETECTOR"
HF_MODEL_REPO = os.environ.get("HF_MODEL_REPO", DEFAULT_MODEL_REPO).strip()

device = torch.device("cpu")
model = None
THRESHOLD = 0.40
_model_lock = threading.Lock()
_load_error = None

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

preprocess = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
])


def build_resnet():
    m = models.resnet18(weights=None)
    in_features = m.fc.in_features
    m.fc = nn.Sequential(
        nn.Dropout(p=0.5),
        nn.Linear(in_features, 128),
        nn.ReLU(),
        nn.Dropout(p=0.4),
        nn.Linear(128, 1),
        nn.Sigmoid(),
    )
    return m


def _resolve_weights_path():
    local_path = os.path.join(os.path.dirname(__file__), "mri_model.pth")
    if os.path.exists(local_path):
        print("[CerebroAI]: Using local mri_model.pth")
        return local_path

    if HF_MODEL_REPO:
        print(f"[CerebroAI]: Downloading weights from {HF_MODEL_REPO}...")
        return hf_hub_download(
            repo_id=HF_MODEL_REPO,
            filename="mri_model.pth",
            repo_type="model",
        )

    return None


def ensure_model_loaded():
    """Lazy load so the container starts fast and passes HF health checks."""
    global model, THRESHOLD, _load_error

    if model is not None:
        return

    with _model_lock:
        if model is not None:
            return

        try:
            m = build_resnet().to(device)
            weights_path = _resolve_weights_path()

            if not weights_path:
                _load_error = "No weights path (set HF_MODEL_REPO secret)"
                print(f"[CerebroAI Warning]: {_load_error}")
                return

            checkpoint = torch.load(weights_path, map_location=device, weights_only=False)
            if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                m.load_state_dict(checkpoint["model_state_dict"])
                THRESHOLD = checkpoint.get("threshold", 0.40)
            else:
                m.load_state_dict(checkpoint)

            m.eval()
            model = m
            _load_error = None
            print(f"[CerebroAI]: Model ready. Threshold={THRESHOLD:.2f}")
        except Exception as e:
            _load_error = str(e)
            print(f"[CerebroAI Warning]: Failed to load weights: {e}")


def generate_gradcam(m, img_tensor, original_bgr):
    gradients, activations = [], []
    fh = m.layer4.register_forward_hook(lambda mod, inp, out: activations.append(out))
    bh = m.layer4.register_full_backward_hook(lambda mod, gi, go: gradients.append(go[0]))

    m.zero_grad()
    out = m(img_tensor)
    out.backward()
    fh.remove()
    bh.remove()

    grads = gradients[0]
    acts = activations[0]
    weights = grads.mean(dim=(2, 3), keepdim=True)
    cam = torch.relu((weights * acts).sum(dim=1)).squeeze(0)
    cam = cam.detach().cpu().numpy()

    cam_min, cam_max = cam.min(), cam.max()
    if cam_max - cam_min > 1e-8:
        cam = (cam - cam_min) / (cam_max - cam_min)
    else:
        cam = np.zeros_like(cam)

    h, w = original_bgr.shape[:2]
    cam_up = cv2.resize(cam, (w, h))
    heatmap = cv2.applyColorMap(np.uint8(255 * cam_up), cv2.COLORMAP_JET)
    heatmap_rgb = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    orig_rgb = cv2.cvtColor(original_bgr, cv2.COLOR_BGR2RGB)
    blended = cv2.addWeighted(orig_rgb, 0.55, heatmap_rgb, 0.45, 0)

    _, buf = cv2.imencode(".png", cv2.cvtColor(blended, cv2.COLOR_RGB2BGR))
    return "data:image/png;base64," + base64.b64encode(buf).decode()


@app.get("/")
def root():
    return {
        "status": "CerebroAI backend running",
        "model_loaded": model is not None,
        "model_repo": HF_MODEL_REPO,
        "load_error": _load_error,
    }


@app.post("/api/predict")
async def predict(image: UploadFile = File(...)):
    ensure_model_loaded()

    if model is None:
        raise HTTPException(
            status_code=503,
            detail=_load_error or "Model not loaded. Check HF_MODEL_REPO secret and Space logs.",
        )

    content_type = image.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type.")

    try:
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img_bgr is None:
            raise HTTPException(status_code=400, detail="Failed to decode image.")

        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        heatmap_b64 = None

        img_tensor = preprocess(img_rgb).unsqueeze(0).to(device)
        try:
            grad_tensor = img_tensor.clone().requires_grad_(True)
            with torch.enable_grad():
                probability = model(grad_tensor).item()
                heatmap_b64 = generate_gradcam(model, grad_tensor, img_bgr)
        except Exception as e:
            print(f"[CerebroAI]: Grad-CAM failed: {e}")
            with torch.no_grad():
                probability = model(img_tensor).item()

        is_tumor = probability >= THRESHOLD
        label = "Tumor" if is_tumor else "No Tumor"
        confidence = float(probability) if is_tumor else float(1.0 - probability)

        print(f"[CerebroAI]: {label} ({confidence * 100:.1f}%)")
        return {"prediction": label, "confidence": round(confidence, 2), "heatmap": heatmap_b64}

    except HTTPException:
        raise
    except Exception as e:
        print(f"[CerebroAI Error]: {e}")
        raise HTTPException(status_code=500, detail=str(e))
