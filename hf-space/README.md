---
title: CerebroAI Backend
emoji: 🧠
colorFrom: blue
colorTo: red
sdk: docker
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

> For research and educational use only. Not for clinical diagnosis.
