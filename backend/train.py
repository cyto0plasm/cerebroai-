"""
CerebroAI — Brain MRI Tumor Classifier
Transfer Learning with ResNet18

Run via train-model.bat
"""

import os, sys, copy, time, random
import numpy as np
import cv2
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler
from torchvision import models, transforms
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix, classification_report
)

# ── Reproducibility ───────────────────────────────────────────────────────────
SEED = 42
random.seed(SEED); np.random.seed(SEED); torch.manual_seed(SEED)

# ── Config ────────────────────────────────────────────────────────────────────
DATA_DIR   = r"D:\Programming\AI\MRI\MRI\data\brain_tumor_dataset"
SAVE_PATH  = r"D:\Programming\AI\MRI\MRI\mri_model.pth"
PLOT_PATH  = r"D:\Programming\AI\MRI\MRI\training_curves.png"

IMG_SIZE   = 224
BATCH_SIZE = 16
EPOCHS     = 80
LR         = 1e-4
PATIENCE   = 12
THRESHOLD  = 0.5   # tuned after training via val set
DEVICE     = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"Device: {DEVICE}\nData:   {DATA_DIR}")

# ── Load paths ────────────────────────────────────────────────────────────────
def load_paths(data_dir):
    paths, labels = [], []
    for f in os.listdir(os.path.join(data_dir, "yes")):
        p = os.path.join(data_dir, "yes", f)
        if os.path.isfile(p): paths.append(p); labels.append(1)
    for f in os.listdir(os.path.join(data_dir, "no")):
        p = os.path.join(data_dir, "no", f)
        if os.path.isfile(p): paths.append(p); labels.append(0)
    return paths, labels

all_paths, all_labels = load_paths(DATA_DIR)
print(f"\nDataset: {len(all_paths)} images  (Tumor={sum(all_labels)}, Healthy={len(all_labels)-sum(all_labels)})")

train_paths, tmp_paths, train_labels, tmp_labels = train_test_split(
    all_paths, all_labels, test_size=0.30, stratify=all_labels, random_state=SEED)
val_paths, test_paths, val_labels, test_labels = train_test_split(
    tmp_paths, tmp_labels, test_size=0.50, stratify=tmp_labels, random_state=SEED)
print(f"Split  → train={len(train_paths)}  val={len(val_paths)}  test={len(test_paths)}")

# ── Transforms ────────────────────────────────────────────────────────────────
MEAN = [0.485, 0.456, 0.406]
STD  = [0.229, 0.224, 0.225]

train_tf = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.RandomRotation(25),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
    transforms.RandomAffine(degrees=0, translate=(0.1, 0.1), scale=(0.85, 1.15)),
    transforms.ToTensor(),
    transforms.Normalize(MEAN, STD),
    transforms.RandomErasing(p=0.25, scale=(0.02, 0.12)),
])

eval_tf = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(MEAN, STD),
])

# ── Dataset ───────────────────────────────────────────────────────────────────
class MRIDataset(Dataset):
    def __init__(self, paths, labels, transform):
        self.paths = paths; self.labels = labels; self.transform = transform
    def __len__(self): return len(self.paths)
    def __getitem__(self, idx):
        img = cv2.imread(self.paths[idx])
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        return self.transform(img), torch.tensor(self.labels[idx], dtype=torch.float32)

train_ds = MRIDataset(train_paths, train_labels, train_tf)
val_ds   = MRIDataset(val_paths,   val_labels,   eval_tf)
test_ds  = MRIDataset(test_paths,  test_labels,  eval_tf)

# Weighted sampler — fixes class imbalance during training
class_counts   = np.bincount(train_labels)
sample_weights = [1.0 / class_counts[l] for l in train_labels]
sampler = WeightedRandomSampler(sample_weights, num_samples=len(train_labels), replacement=True)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, sampler=sampler, num_workers=0)
val_loader   = DataLoader(val_ds,   batch_size=BATCH_SIZE, shuffle=False,   num_workers=0)
test_loader  = DataLoader(test_ds,  batch_size=BATCH_SIZE, shuffle=False,   num_workers=0)

# ── Model ─────────────────────────────────────────────────────────────────────
def build_model():
    m = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    for param in m.parameters():
        param.requires_grad = False
    # Unfreeze last two residual blocks
    for param in m.layer3.parameters(): param.requires_grad = True
    for param in m.layer4.parameters(): param.requires_grad = True
    # New head — stronger dropout to prevent "always tumor" shortcut
    m.fc = nn.Sequential(
        nn.Dropout(p=0.5),
        nn.Linear(m.fc.in_features, 128),
        nn.ReLU(),
        nn.Dropout(p=0.4),
        nn.Linear(128, 1),
        # No Sigmoid here — BCEWithLogitsLoss handles it during training
    )
    return m.to(DEVICE)

model = build_model()
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
total     = sum(p.numel() for p in model.parameters())
print(f"\nModel: ResNet18  |  Trainable: {trainable:,} / {total:,}")

# ── Loss & Optimiser ──────────────────────────────────────────────────────────
# Plain BCE — imbalance already handled by weighted sampler above
criterion = nn.BCEWithLogitsLoss()

optimizer = optim.AdamW(
    filter(lambda p: p.requires_grad, model.parameters()),
    lr=LR, weight_decay=1e-4
)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="min", factor=0.5, patience=5)

# ── Training loop ─────────────────────────────────────────────────────────────
def run_epoch(loader, training=True, threshold=0.5):
    model.train() if training else model.eval()
    total_loss, all_preds, all_labels_out, all_probs = 0.0, [], [], []

    ctx = torch.enable_grad() if training else torch.no_grad()
    with ctx:
        for imgs, labels in loader:
            imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
            if training: optimizer.zero_grad()
            logits = model(imgs).squeeze(1)
            loss   = criterion(logits, labels)
            if training:
                loss.backward()
                nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                optimizer.step()
            probs = torch.sigmoid(logits).detach().cpu().numpy()
            preds = (probs >= threshold).astype(int)
            total_loss += loss.item() * len(labels)
            all_probs.extend(probs.tolist())
            all_preds.extend(preds.tolist())
            all_labels_out.extend(labels.cpu().numpy().tolist())

    n = len(all_labels_out)
    return total_loss / n, accuracy_score(all_labels_out, all_preds), all_labels_out, all_preds, all_probs

print("\n" + "─" * 65)
print(f"{'Epoch':>6}  {'TrLoss':>8}  {'TrAcc':>7}  {'VlLoss':>8}  {'VlAcc':>7}  {'LR':>8}")
print("─" * 65)

best_val_loss, best_weights, patience_count = float("inf"), None, 0
history = {"train_loss": [], "val_loss": [], "train_acc": [], "val_acc": []}

for epoch in range(1, EPOCHS + 1):
    t0 = time.time()
    tr_loss, tr_acc, *_ = run_epoch(train_loader, training=True)
    vl_loss, vl_acc, *_ = run_epoch(val_loader,   training=False)
    scheduler.step(vl_loss)

    history["train_loss"].append(tr_loss); history["val_loss"].append(vl_loss)
    history["train_acc"].append(tr_acc);   history["val_acc"].append(vl_acc)

    lr_now = optimizer.param_groups[0]["lr"]
    print(f"{epoch:>6}  {tr_loss:>8.4f}  {tr_acc:>7.4f}  {vl_loss:>8.4f}  {vl_acc:>7.4f}  {lr_now:>8.2e}  ({time.time()-t0:.1f}s)")

    if vl_loss < best_val_loss:
        best_val_loss = vl_loss
        best_weights  = copy.deepcopy(model.state_dict())
        patience_count = 0
        print(f"         ✓ Best val loss: {best_val_loss:.4f}")
    else:
        patience_count += 1
        if patience_count >= PATIENCE:
            print(f"\nEarly stopping at epoch {epoch}")
            break

print("─" * 65)

# ── Find best threshold on validation set ─────────────────────────────────────
model.load_state_dict(best_weights)
model.eval()

_, _, val_true, _, val_probs = run_epoch(val_loader, training=False, threshold=0.5)
val_probs_arr = np.array(val_probs)

best_thresh, best_f1 = 0.5, 0.0
for t in np.arange(0.3, 0.8, 0.02):
    preds = (val_probs_arr >= t).astype(int)
    f1 = f1_score(val_true, preds, zero_division=0)
    if f1 > best_f1:
        best_f1, best_thresh = f1, t

print(f"\nBest threshold (from val set): {best_thresh:.2f}  (F1={best_f1:.4f})")

# ── Test set evaluation ───────────────────────────────────────────────────────
_, _, y_true, y_pred, y_prob = run_epoch(test_loader, training=False, threshold=best_thresh)

print("\n" + "═" * 60)
print("TEST SET RESULTS")
print("═" * 60)
print(classification_report(y_true, y_pred, target_names=["Healthy", "Tumor"],
                             digits=4, zero_division=0))

cm = confusion_matrix(y_true, y_pred)
tn, fp, fn, tp = cm.ravel()
print(f"Confusion Matrix:")
print(f"  True Negative  (Healthy → Healthy): {tn}")
print(f"  False Positive (Healthy → Tumor):   {fp}")
print(f"  False Negative (Tumor   → Healthy): {fn}  ← want this = 0")
print(f"  True Positive  (Tumor   → Tumor):   {tp}")

try:
    auc = roc_auc_score(y_true, y_prob)
    print(f"\nROC-AUC:   {auc:.4f}  (1.0 = perfect, 0.5 = random)")
except Exception: pass

print(f"Accuracy:  {accuracy_score(y_true, y_pred):.4f}")
print(f"Precision: {precision_score(y_true, y_pred, zero_division=0):.4f}  (of predicted tumors, how many were real)")
print(f"Recall:    {recall_score(y_true, y_pred, zero_division=0):.4f}  (of real tumors, how many did we catch)")
print(f"F1 Score:  {f1_score(y_true, y_pred, zero_division=0):.4f}  (balance of precision + recall)")
print("═" * 60)

# ── Save weights (with threshold embedded) ────────────────────────────────────
# Add Sigmoid back for inference
model.fc.add_module("sigmoid", nn.Sigmoid())

save_data = {
    "model_state_dict": model.state_dict(),
    "threshold": best_thresh,
    "architecture": "resnet18",
}
torch.save(save_data, SAVE_PATH)
print(f"\n✓ Weights + threshold ({best_thresh:.2f}) saved to: {SAVE_PATH}")

# ── Training curves ───────────────────────────────────────────────────────────
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
ax1.plot(history["train_loss"], label="Train"); ax1.plot(history["val_loss"], label="Val")
ax1.set_title("Loss"); ax1.set_xlabel("Epoch"); ax1.legend(); ax1.grid(True)
ax2.plot(history["train_acc"], label="Train"); ax2.plot(history["val_acc"], label="Val")
ax2.set_title("Accuracy"); ax2.set_xlabel("Epoch"); ax2.legend(); ax2.grid(True)
plt.tight_layout(); plt.savefig(PLOT_PATH, dpi=120)
print(f"✓ Training curves saved to: {PLOT_PATH}")
print("\nDone. Run start-backend.bat to serve the new model.")
