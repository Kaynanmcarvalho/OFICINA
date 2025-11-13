"""
Quick Training Script

Treinamento rápido para teste (10 épocas)
Útil para verificar se tudo está funcionando

@author Torq AI Team
@version 1.0.0
"""

from ultralytics import YOLO
import torch

print("\n" + "=" * 80)
print("  Quick Training Test (10 epochs)")
print("=" * 80 + "\n")

# Check device
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"Device: {device}")

# Load model
print("\nLoading YOLOv8n...")
model = YOLO('yolov8n.pt')

# Train
print("\nStarting training...")
print("This will take a few minutes...\n")

results = model.train(
    data='car_damage.yaml',
    epochs=10,
    imgsz=640,
    batch=4,
    device=device,
    patience=5,
    save=True,
    project='runs/train',
    name='quick_test',
    exist_ok=True,
    verbose=True
)

print("\n" + "=" * 80)
print("  Training Complete!")
print("=" * 80)

print(f"\nResults saved in: runs/train/quick_test/")
print("\nNext steps:")
print("  1. Check results: runs/train/quick_test/results.png")
print("  2. Test model: python test_detector.py")
print("  3. For full training: python train.py")
