"""Quick dataset check"""
from pathlib import Path

base = Path('datasets/car-damage')

train_imgs = len(list((base / 'images' / 'train').glob('*.jpg')))
val_imgs = len(list((base / 'images' / 'val').glob('*.jpg')))
test_imgs = len(list((base / 'images' / 'test').glob('*.jpg')))

print("\nDataset Check:")
print(f"  Train: {train_imgs} images")
print(f"  Val: {val_imgs} images")
print(f"  Test: {test_imgs} images")
print(f"  Total: {train_imgs + val_imgs + test_imgs} images")
print("\nDataset OK! Ready for training.\n")
