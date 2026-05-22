---
title: CerebroAI Backend
emoji: 🧠
colorFrom: blue
colorTo: red
sdk: docker
app_port: 7860
pinned: false
---

# CerebroAI — Brain MRI Tumor Detection API

FastAPI backend serving a fine-tuned ResNet18 model for brain MRI tumor classification.

## Endpoint

`POST /api/predict` — multipart form with `image` field.

Returns:
```json
{
  "prediction": "Tumor" | "No Tumor",
  "confidence": 0.94,
  "heatmap": "data:image/png;base64,..."
}
```

## Space secret (Settings → Repository secrets)

| Name | Value |
|------|--------|
| `HF_MODEL_REPO` | `cyto0plasm/MRI_IMAGING_TOMUR_DETECTOR` |

> For research and educational use only. Not for clinical diagnosis.
