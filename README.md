# 🧠 Cerebro — Brain MRI Tumor Screening

> Full-stack ML web app: upload an MRI slice → **ResNet18 inference + Grad-CAM** → structured report. Vue 3 frontend on Vercel, FastAPI on Hugging Face, optional Supabase auth.

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=vue.js&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Hugging Face](https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Repo:** [github.com/cyto0plasm/cerebroai-](https://github.com/cyto0plasm/cerebroai-) · **API:** [cyto0plasm-cerebroai-backend.hf.space](https://cyto0plasm-cerebroai-backend.hf.space)

---

## At a glance *(recruiters — 30 sec)*

| | |
|---|---|
| **Problem** | Screen a single brain MRI slice and explain *where* the model looked |
| **My role** | End-to-end: UI, API integration, auth, cloud persistence, deploy pipeline |
| **Frontend** | Vue 3 · Vite · Pinia · Tailwind · dark mode · DICOM client-side |
| **Backend / ML** | FastAPI · PyTorch ResNet18 · Grad-CAM · Docker on Hugging Face |
| **Data / auth** | Supabase (PostgreSQL + RLS, optional member accounts) |
| **Deploy** | Vercel (SPA) + Hugging Face Space (GPU inference) |

> **Research & education only** — not a medical device or clinical diagnostic tool.

---

## What this project demonstrates

- **Full-stack delivery** — separate frontend, inference API, and optional database with real deploy targets
- **ML in production** — model weights on HF Hub, inference behind a REST API, heatmaps returned to the client
- **Product thinking** — guest vs member modes, export/print reports, profile + study history, onboarding
- **Security basics** — Supabase RLS, sanitized cloud payloads, auth error mapping, import limits
- **DevOps** — env-based config, Vite build, PowerShell deploy script for HF Space

---

## Overview

**Cerebro** is a brain MRI **screening workspace**. Users upload one axial slice (JPEG, PNG, TIFF, BMP, or DICOM) and get:

- **Tumor / No tumor** label + confidence
- **Grad-CAM** activation maps (original, heatmap, side-by-side, probabilities)
- **Structured report** (findings, recommendation) with export/print

**Guests** analyze in a temporary session. **Members** (Supabase) get cloud-saved studies, rename, compare, and session import/export.

---

## Key features

- 🔬 ResNet18 binary classifier (224×224)
- 🗺️ Collapsible visual analysis panel per study
- 📄 Export / print screening report
- 👤 Guest session or Supabase member workspace
- 📁 DICOM → image conversion in the browser
- 🌙 Light / dark theme
- 📱 Profile page with study list + detail dialog

---

## Architecture *(developers)*

```
┌─────────────────────────────────────────────────────────┐
│  Vue 3 SPA (Vercel)                                     │
│  Pinia · Vue Router · Tailwind                          │
│  src/pages · src/stores · src/services                  │
└──────────────────────────┬──────────────────────────────┘
                           │ VITE_API_BASE_URL
                           ▼
┌─────────────────────────────────────────────────────────┐
│  FastAPI (Hugging Face Space, Docker)                   │
│  hf-space/app.py · ResNet18 · Grad-CAM                  │
│  Weights: HF Model repo (mri_model.pth)                 │
└──────────────────────────┬──────────────────────────────┘
                           │ optional
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Supabase — Auth + public.scans (RLS)                   │
│  supabase/schema.sql                                    │
└─────────────────────────────────────────────────────────┘
```

### Request flow

1. Client validates file (size, dimensions, DICOM)
2. `POST /predict` with image multipart
3. API returns prediction, confidence, heatmap (base64), report text
4. Pinia updates UI; members optionally `upsert` to Supabase

### Where things live

| What | Path |
|------|------|
| Frontend app | `src/` |
| Pages | `src/pages/` (Landing, Dashboard, Profile, Limitations) |
| State | `src/stores/` (`auth`, `prediction`, `app`) |
| HF Space source | `hf-space/` |
| Local dev API | `backend/` |
| DB schema | `supabase/schema.sql` |
| Deploy backend | `deploy-backend.ps1` → `hf-space-deploy/` |

---

## Quick start *(developers)*

```bash
git clone https://github.com/cyto0plasm/cerebroai-.git
cd cerebroai-
npm install
cp .env.example .env.local   # edit VITE_* values
npm run dev
```

Open **http://localhost:3000**

Use the hosted API (default in `.env.example`) — no local Python required for frontend work.

**Optional local API:**

```powershell
.\start-backend.bat
# → http://localhost:8000
# set VITE_API_BASE_URL=http://localhost:8000 in .env.local
```

---

## Environment variables *(future you)*

```env
# .env.local (never commit)
VITE_API_BASE_URL=https://cyto0plasm-cerebroai-backend.hf.space
VITE_SUPABASE_URL=https://YOUR_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

| Variable | Local | Vercel prod |
|----------|-------|-------------|
| `VITE_API_BASE_URL` | HF Space or localhost:8000 | HF Space URL |
| `VITE_SUPABASE_URL` | Your Supabase project | Same |
| `VITE_SUPABASE_ANON_KEY` | Anon public key | Same |

After any change: restart `npm run dev` locally · **Redeploy** on Vercel (Vite inlines env at build).

Details: [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md)

---

## Deploy cheat sheet *(future you)*

| Step | Action |
|------|--------|
| **Frontend** | `git push origin main` → Vercel auto-builds from `main` |
| **Vercel env** | Settings → Environment Variables → all three `VITE_*` → Redeploy |
| **Backend** | `.\deploy-backend.ps1 -HfUsername cyto0plasm` then `git push` in `hf-space-deploy/` |
| **Model** | Weights on HF model repo; Space secret `HF_MODEL_REPO` |
| **Supabase** | Run `supabase/schema.sql`; add Vercel URL to auth redirect allowlist |

Long form: [`DEPLOY.md`](DEPLOY.md) · [`YOU-DEPLOY.txt`](YOU-DEPLOY.txt) · [`PUSH-HF-BACKEND.txt`](PUSH-HF-BACKEND.txt)

---

## Guest vs member

| | Guest | Member |
|---|--------|--------|
| Screen slices | ✅ | ✅ |
| Plots & report | ✅ | ✅ |
| Cloud history | ❌ | ✅ |
| Rename / compare / import | ❌ | ✅ |

---

## Tech stack

**Frontend:** Vue 3 · Vite · Pinia · Vue Router · Tailwind CSS · Lucide · Axios · dicom-parser · Supabase JS

**Backend:** Python · FastAPI · PyTorch · ResNet18 · Grad-CAM · Docker · Hugging Face Spaces

**Infra:** Vercel · Hugging Face (API + model weights) · Supabase (optional)

---

## Related docs

- [`DEPLOY.md`](DEPLOY.md) — full deployment guide
- [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) — auth + database
- [`BACKEND-SETUP.md`](BACKEND-SETUP.md) — local backend & training

---

## Author

**Youssef Zaki** — [@cyto0plasm](https://github.com/cyto0plasm) · [Portfolio](https://eng-youssef.vercel.app)
