# Deployment Guide — CerebroAI

Two parts:
- **Backend** → Hugging Face Spaces (free, runs PyTorch)
- **Frontend** → Vercel (free, instant)

Total time: ~20 minutes.

---

## PART 1 — Upload model weights to Hugging Face

Your model file is too large for GitHub. We store it on Hugging Face Model Hub.

### 1.1 Create a Hugging Face account
Go to https://huggingface.co/join and sign up (free).

### 1.2 Create a new Model repository
1. Go to https://huggingface.co/new
2. Set Repository name: `cerebroai-model`
3. Set visibility: **Public**
4. Click **Create model**

### 1.3 Upload the weights file
1. On your new model page, click **"Add file"** → **"Upload files"**
2. Upload: `D:\Programming\AI\MRI\MRI\mri_model.pth`
3. Commit the file

Your model is now at: `https://huggingface.co/YOUR_USERNAME/cerebroai-model`

---

## PART 2 — Deploy the backend to Hugging Face Spaces

### 2.1 Create a new Space
1. Go to https://huggingface.co/new-space
2. Space name: `cerebroai-backend`
3. SDK: **Docker**
4. Visibility: **Public**
5. Click **Create Space**

### 2.2 Push the backend code
Open a terminal and run these commands:

```bash
# Install git-lfs if you haven't
git lfs install

# Clone your new Space
git clone https://huggingface.co/spaces/YOUR_USERNAME/cerebroai-backend
cd cerebroai-backend

# Copy the backend files into it
# (copy everything from the hf-space/ folder in this project)
copy "C:\Users\cyto0\.gemini\antigravity\scratch\brain-mri-tumor-detector\hf-space\*" .

# Push
git add .
git commit -m "Initial backend deployment"
git push
```

### 2.3 Set the model repo secret
1. On your Space page, go to **Settings** → **Repository secrets**
2. Add a secret:
   - Name: `HF_MODEL_REPO`
   - Value: `YOUR_USERNAME/cerebroai-model`
3. Save

### 2.4 Wait for it to build
Hugging Face will build the Docker container (~3-5 minutes).
When it shows **"Running"**, your backend URL is:
```
https://YOUR_USERNAME-cerebroai-backend.hf.space
```

Test it by visiting: `https://YOUR_USERNAME-cerebroai-backend.hf.space/`
You should see: `{"status":"CerebroAI backend running","model_loaded":true}`

---

## PART 3 — Deploy the frontend to Vercel

### 3.1 Push frontend to GitHub
Open a terminal in the project folder and run:

```bash
cd "C:\Users\cyto0\.gemini\antigravity\scratch\brain-mri-tumor-detector"

git init
git add .
git commit -m "Initial commit"

# Create a new repo on GitHub first at https://github.com/new
# Name it: cerebroai
# Then:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/cerebroai.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `cerebroai` GitHub repo
4. Vercel auto-detects Vite — just click **Deploy**

### 3.3 Set the environment variable
1. After deploy, go to your project **Settings** → **Environment Variables**
2. Add:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://YOUR_USERNAME-cerebroai-backend.hf.space`
   - Environment: **Production**
3. Go to **Deployments** → click the three dots on latest → **Redeploy**

### 3.4 Done
Your app is live at: `https://cerebroai.vercel.app` (or similar)

---

## Summary of URLs

| Thing | URL |
|-------|-----|
| Frontend | `https://YOUR_PROJECT.vercel.app` |
| Backend API | `https://YOUR_USERNAME-cerebroai-backend.hf.space` |
| Model weights | `https://huggingface.co/YOUR_USERNAME/cerebroai-model` |

---

## Important note for users

Add this disclaimer to your app — Hugging Face Spaces free tier **sleeps after 48h of inactivity**.
The first request after sleep takes ~30 seconds to wake up. After that it's fast.

To keep it always awake you need a paid HF account ($9/mo) — not necessary for a portfolio project.
