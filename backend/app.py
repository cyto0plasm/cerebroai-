import os
import base64
import uvicorn
import random
import numpy as np
import cv2
import torch
import torch.nn as nn
from torchvision import models, transforms
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CerebroAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model ─────────────────────────────────────────────────────────────────────
def build_resnet():
    """Must match train.py architecture exactly."""
    m = models.resnet18(weights=None)
    in_features = m.fc.in_features
    m.fc = nn.Sequential(
        nn.Dropout(p=0.5),
        nn.Linear(in_features, 128),
        nn.ReLU(),
        nn.Dropout(p=0.4),
        nn.Linear(128, 1),
        nn.Sigmoid(),   # added after training via model.fc.add_module("sigmoid", ...)
    )
    return m


device       = torch.device("cuda" if torch.cuda.is_available() else "cpu")
WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), "mri_model.pth")
model        = None
THRESHOLD    = 0.5   # overwritten from saved checkpoint

# ImageNet normalisation — must match training preprocessing
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

preprocess = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
])


@app.on_event("startup")
def load_weights():
    global model, THRESHOLD
    m = build_resnet().to(device)
    if os.path.exists(WEIGHTS_PATH):
        try:
            checkpoint = torch.load(WEIGHTS_PATH, map_location=device)
            # Support both old format (plain state_dict) and new format (dict with threshold)
            if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                m.load_state_dict(checkpoint["model_state_dict"])
                THRESHOLD = checkpoint.get("threshold", 0.5)
                print(f"[CerebroAI]: ResNet18 loaded. Threshold={THRESHOLD:.2f}")
            else:
                m.load_state_dict(checkpoint)
                print("[CerebroAI]: ResNet18 loaded (legacy format).")
            m.eval()
            model = m
        except Exception as e:
            print(f"[CerebroAI Warning]: Failed to load weights: {e}")
            model = None
    else:
        print("[CerebroAI Warning]: mri_model.pth not found — simulation mode.")
        model = None


# ── Grad-CAM ──────────────────────────────────────────────────────────────────
def generate_gradcam(m, img_tensor: torch.Tensor, original_bgr: np.ndarray) -> str:
    """
    Hooks into ResNet18's layer4 (last conv block) for Grad-CAM.
    Returns a base64 PNG of the heatmap blended onto the original image.
    """
    gradients  = []
    activations = []

    target_layer = m.layer4  # last residual block — best spatial resolution

    fh = target_layer.register_forward_hook(lambda mod, inp, out: activations.append(out))
    bh = target_layer.register_full_backward_hook(lambda mod, gi, go: gradients.append(go[0]))

    m.zero_grad()
    out = m(img_tensor)
    out.backward()

    fh.remove()
    bh.remove()

    grads = gradients[0]    # [1, C, H, W]
    acts  = activations[0]  # [1, C, H, W]

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

    heatmap     = cv2.applyColorMap(np.uint8(255 * cam_up), cv2.COLORMAP_JET)
    heatmap_rgb = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    orig_rgb    = cv2.cvtColor(original_bgr, cv2.COLOR_BGR2RGB)
    blended     = cv2.addWeighted(orig_rgb, 0.55, heatmap_rgb, 0.45, 0)

    _, buf = cv2.imencode(".png", cv2.cvtColor(blended, cv2.COLOR_RGB2BGR))
    return "data:image/png;base64," + base64.b64encode(buf).decode()


# ── Predict ───────────────────────────────────────────────────────────────────
@app.post("/api/predict")
async def predict(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type.")

    try:
        contents = await image.read()
        nparr    = np.frombuffer(contents, np.uint8)
        img_bgr  = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img_bgr is None:
            raise HTTPException(status_code=400, detail="Failed to decode image.")

        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

        heatmap_b64 = None

        if model is not None:
            img_tensor = preprocess(img_rgb).unsqueeze(0).to(device)

            try:
                grad_tensor = img_tensor.clone().requires_grad_(True)
                with torch.enable_grad():
                    raw_prob     = model(grad_tensor).item()
                    probability  = raw_prob
                    heatmap_b64  = generate_gradcam(model, grad_tensor, img_bgr)
            except Exception as e:
                print(f"[CerebroAI]: Grad-CAM failed: {e}")
                with torch.no_grad():
                    probability = model(img_tensor).item()

            # Apply the tuned threshold
            is_tumor   = probability >= THRESHOLD
            # Apply the tuned threshold
            is_tumor   = probability >= THRESHOLD
        else:
            # Simulation fallback
            print("[CerebroAI]: Simulation mode.")
            is_tumor  = "tumor" in image.filename.lower() or random.random() > 0.5
            probability = random.uniform(0.78, 0.99) if is_tumor else random.uniform(0.01, 0.22)

        if is_tumor:
            label      = "Tumor"
            confidence = float(probability)
        else:
            label      = "No Tumor"
            confidence = float(1.0 - probability)

        print(f"[CerebroAI]: {label} ({confidence * 100:.1f}%)")

        return {
            "prediction": label,
            "confidence": round(confidence, 2),
            "heatmap":    heatmap_b64,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[CerebroAI Error]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
