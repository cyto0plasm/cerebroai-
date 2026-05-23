# CerebroAI

Brain MRI tumor screening workspace with Grad-CAM review, member cloud storage, and guest sessions.

## Local development

```bash
npm install
npm run dev
```

Backend (optional, local): run `start-backend.bat` or `uvicorn` in `backend/`.

## Environment

Copy `.env.example` to `.env.local` and set:

- `VITE_API_BASE_URL` — analysis API (Hugging Face Space URL in production)
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` — optional; enables sign-in and cloud workspace

Run `supabase/schema.sql` in your Supabase project SQL editor.

## Deploy

- **Frontend:** push to GitHub → Vercel
- **Backend:** `.\deploy-backend.ps1 -HfUsername YOUR_HF_USER` then `git push` from `hf-space-deploy`

## Guest vs member

| | Guest | Member |
|---|--------|--------|
| Screen slices | Yes | Yes |
| Plots & report | Yes | Yes |
| Persist history | No (session only) | Yes (Supabase) |
| Rename studies | No | Yes |
| Compare / export | No | Yes |
