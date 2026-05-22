# CerebroAI Backend Setup Guide

## Quick Start (Without Trained Model)

If you just want to test the app with simulated predictions:

1. **Double-click** `start-backend.bat`
2. Wait for the message: `Application startup complete`
3. Keep that window open
4. Refresh your Vue app in the browser
5. Upload an MRI image - it will use simulated predictions

---

## Full Setup (With Real AI Model)

### Step 1: Train Your Model (If Not Already Done)

1. Open Jupyter Notebook or JupyterLab
2. Navigate to: `D:\Programming\AI\MRI\MRI\`
3. Open: `Class-MRI-Brain-Tumor.ipynb`
4. Run all cells to train the model
5. Wait for training to complete

### Step 2: Export Model Weights

After training completes, add a **new cell** at the end of your notebook and run:

```python
import torch
torch.save(model.state_dict(), 'mri_model.pth')
print('✓ Model weights saved successfully!')
```

This creates `mri_model.pth` in the same folder as your notebook.

### Step 3: Verify Export (Optional)

Double-click `export-model-weights.py` to check if the weights file exists.

### Step 4: Start the Backend Server

1. **Double-click** `start-backend.bat`
2. You should see:
   ```
   [CerebroAI]: Loading PyTorch model weights from ...
   [CerebroAI]: Model weights successfully loaded into memory!
   Application startup complete.
   ```
3. Keep this window open while using the app

### Step 5: Test the App

1. Go to your Vue app: http://localhost:3000
2. Upload an MRI image
3. Click "Compute Telemetry"
4. You should see real predictions from your trained model!

---

## Troubleshooting

### Backend won't start
- Make sure port 8000 is not already in use
- Check that Python and all packages are installed
- Try running: `D:\Programming\AI\MRI\.venv\Scripts\python.exe -m pip install fastapi uvicorn`

### "Model weights not found" warning
- You haven't exported the model yet
- The server will run in simulation mode (random predictions)
- Follow Step 2 above to export your trained model

### Frontend shows "ERR_CONNECTION_REFUSED"
- The backend server is not running
- Start it using `start-backend.bat`

### Always getting "No Tumor" results
- This was a bug in the mock fallback (now fixed)
- Start the real backend server for accurate predictions
- Or refresh the page and try uploading different images

---

## File Locations

- **Backend Server**: `D:\Programming\AI\MRI\MRI\app.py`
- **Model Weights**: `D:\Programming\AI\MRI\MRI\mri_model.pth` (after export)
- **Training Notebook**: `D:\Programming\AI\MRI\MRI\Class-MRI-Brain-Tumor.ipynb`
- **Frontend**: `c:\Users\cyto0\.gemini\antigravity\scratch\brain-mri-tumor-detector\`

---

## What Each File Does

- **start-backend.bat** - Starts the FastAPI server on port 8000
- **export-model-weights.py** - Helper script to check if model weights exist
- **app.py** - The FastAPI backend that runs predictions
- **mri_model.pth** - Your trained model weights (created after training)
