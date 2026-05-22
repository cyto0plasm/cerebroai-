"""
Script to export trained model weights from your Jupyter notebook
Run this AFTER training your model in the notebook
"""
import sys
import os

# Add the MRI directory to path
sys.path.insert(0, r'D:\Programming\AI\MRI\MRI')

try:
    import torch
    import torch.nn as nn
    
    print("=" * 60)
    print("CerebroAI Model Weight Exporter")
    print("=" * 60)
    print()
    
    # Define the CNN architecture (must match your notebook)
    class CNN(nn.Module):
        def __init__(self):
            super(CNN, self).__init__()
            self.cnn_model = nn.Sequential(
                nn.Conv2d(in_channels=3, out_channels=6, kernel_size=5),
                nn.Tanh(),
                nn.AvgPool2d(kernel_size=2, stride=5),
                nn.Conv2d(in_channels=6, out_channels=16, kernel_size=5),
                nn.Tanh(),
                nn.AvgPool2d(kernel_size=2, stride=5),
            )
            
            self.fc_model = nn.Sequential(
                nn.Linear(in_features=256, out_features=120),
                nn.Tanh(),
                nn.Linear(in_features=120, out_features=84),
                nn.Tanh(),
                nn.Linear(in_features=84, out_features=1)
            )
        
        def forward(self, x):
            x = x.permute(0, 3, 1, 2)
            x = self.cnn_model(x)
            x = x.reshape(x.size(0), -1)
            x = self.fc_model(x)
            x = torch.sigmoid(x)
            return x
    
    print("✓ Model architecture loaded")
    print()
    print("INSTRUCTIONS:")
    print("-" * 60)
    print("1. Open your Jupyter notebook: Class-MRI-Brain-Tumor.ipynb")
    print("2. Train your model (run all training cells)")
    print("3. After training completes, add a NEW cell at the end")
    print("4. Copy and paste this code into that cell:")
    print()
    print("   " + "─" * 56)
    print("   import torch")
    print("   torch.save(model.state_dict(), 'mri_model.pth')")
    print("   print('✓ Model weights saved to mri_model.pth')")
    print("   " + "─" * 56)
    print()
    print("5. Run that cell")
    print("6. The file 'mri_model.pth' will be created in:")
    print(f"   D:\\Programming\\AI\\MRI\\MRI\\")
    print()
    print("7. Then run start-backend.bat to start the server")
    print("=" * 60)
    print()
    
    # Check if weights already exist
    weights_path = r'D:\Programming\AI\MRI\MRI\mri_model.pth'
    if os.path.exists(weights_path):
        print("✓ FOUND: mri_model.pth already exists!")
        print(f"  Location: {weights_path}")
        print()
        print("  Your model is ready. Just run start-backend.bat")
    else:
        print("✗ NOT FOUND: mri_model.pth does not exist yet")
        print()
        print("  Follow the instructions above to export your trained model")
    
    print()
    print("=" * 60)
    
except ImportError as e:
    print(f"ERROR: Missing required package: {e}")
    print("Make sure PyTorch is installed in your environment")
except Exception as e:
    print(f"ERROR: {e}")

input("\nPress Enter to close...")
