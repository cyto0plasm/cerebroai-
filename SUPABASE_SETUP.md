# Supabase setup (CerebroAI)

## 1. Database

Supabase dashboard → **SQL Editor** → run `supabase/schema.sql`.

## 2. Local `.env.local` (project root)

```env
VITE_SUPABASE_URL=https://YOUR_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...anon-key...
VITE_API_BASE_URL=https://cyto0plasm-cerebroai-backend.hf.space
```

- URL = **Project Settings → API → Project URL** (no `/rest/v1`)
- Key = **anon public** (not service_role)

Restart after any change:

```powershell
npm run dev
```

Open **http://localhost:3000/dashboard** (not 5173).

## 3. Auth URLs

**Authentication → URL Configuration**

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**` and your Vercel URL `https://....vercel.app/**`

## 4. Email (easier testing)

**Authentication → Providers → Email** → disable **Confirm email** (optional).

## 5. Vercel (production)

Project → **Settings → Environment Variables** — same three `VITE_*` vars → **Redeploy**.

## Users vs scans

| Data | Where |
|------|--------|
| Accounts | **Authentication → Users** |
| Saved studies | **Table Editor → scans** |
