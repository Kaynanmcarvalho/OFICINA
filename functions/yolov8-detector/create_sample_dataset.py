"""
Create Sample Dataset

Cria um dataset de exemplo para testar o sistema
Útil quando não há datasets reais disponíveis

@author Torq AI Team
@version 1.0.0
"""

import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import random


def create_sample_image_with_damage(output_path, damage_type, image_size=(640, 640)):
    """Create a sample image with simulated damage"""
    
    # Create base image (car-like colors)
    colors = [
        (200, 200, 200),  # Silver
        (50, 50, 50),     # Black
        (255, 255, 255),  # White
        (150, 150, 200),  # Blue
        (200, 50, 50),    # Red
    ]
    
    base_color = random.choice(colors)
    img = Image.new('RGB', image_size, base_color)
    draw = ImageDraw.Draw(img)
    
    # Add some texture
    for _ in range(100):
        x = random.randint(0, image_size[0])
        y = random.randint(0, image_size[1])
        size = random.randint(5, 20)
        color_variation = random.randint(-30, 30)
        color = tuple(max(0, min(255, c + color_variation)) for c in base_color)
        draw.ellipse([x, y, x+size, y+size], fill=color)
    
    # Add damage simulation
    damage_x = random.randint(100, image_size[0] - 200)
    damage_y = random.randint(100, image_size[1] - 200)
    damage_w = random.randint(50, 150)
    damage_h = random.randint(50, 150)
    
    if 'scratch' in damage_type:
        # Draw scratch
        for i in range(5):
            offset = random.randint(-10, 10)
            draw.line(
                [(damage_x + offset, damage_y), 
                 (damage_x + damage_w + offset, damage_y + damage_h)],
                fill=(100, 100, 100),
                width=random.randint(2, 5)
            )
    
    elif 'dent' in damage_type:
        # Draw dent (darker area)
        draw.ellipse(
            [damage_x, damage_y, damage_x + damage_w, damage_y + damage_h],
            fill=tuple(max(0, c - 50) for c in base_color)
        )
    
    elif 'rust' in damage_type:
        # Draw rust (orange/brown spots)
        for _ in range(20):
            x = damage_x + random.randint(0, damage_w)
            y = damage_y + random.randint(0, damage_h)
            size = random.randint(5, 15)
            draw.ellipse([x, y, x+size, y+size], fill=(180, 100, 50))
    
    elif 'broken' in damage_type:
        # Draw broken area (cracks)
        for _ in range(10):
            x1 = damage_x + random.randint(0, damage_w)
            y1 = damage_y + random.randint(0, damage_h)
            x2 = x1 + random.randint(-30, 30)
            y2 = y1 + random.randint(-30, 30)
            draw.line([(x1, y1), (x2, y2)], fill=(50, 50, 50), width=2)
    
    else:
        # Generic damage
        draw.rectangle(
            [damage_x, damage_y, damage_x + damage_w, damage_y + damage_h],
            outline=(255, 0, 0),
            width=3
        )
    
    # Add label text
    try:
        font = ImageFont.truetype("arial.ttf", 20)
    except:
        font = ImageFont.load_default()
    
    draw.text((10, 10), f"Sample: {damage_type}", fill=(255, 255, 0), font=font)
    
    # Save image
    img.save(output_path)
    
    # Return bounding box (normalized)
    bbox = {
        'x_center': (damage_x + damage_w/2) / image_size[0],
        'y_center': (damage_y + damage_h/2) / image_size[1],
        'width': damage_w / image_size[0],
        'height': damage_h / image_size[1]
    }
    
    return bbox


def create_yolo_annotation(bbox, class_id, output_path):
    """Create YOLO format annotation file"""
    with open(output_path, 'w') as f:
        f.write(f"{class_id} {bbox['x_center']:.6f} {bbox['y_center']:.6f} {bbox['width']:.6f} {bbox['height']:.6f}\n")


def create_sample_dataset(num_samples=100):
    """Create a complete sample dataset"""
    
    print("\n" + "=" * 80)
    print("  📦 Creating Sample Dataset")
    print("=" * 80 + "\n")
    
    # Damage types and their class IDs
    damage_types = {
        'broken_glass': 0,
        'broken_light': 1,
        'bumper_damage': 2,
        'dent': 3,
        'scratch': 4,
        'rust': 5,
        'paint_damage': 6,
        'flat_tire': 7,
        'tire_wear': 8,
        'mirror_damage': 9,
        'door_damage': 10,
        'hood_damage': 11,
        'trunk_damage': 12,
        'wheel_damage': 13
    }
    
    # Create directories
    base_dir = Path('datasets/car-damage')
    
    for split in ['train', 'val', 'test']:
        (base_dir / 'images' / split).mkdir(parents=True, exist_ok=True)
        (base_dir / 'labels' / split).mkdir(parents=True, exist_ok=True)
    
    print(f"Creating {num_samples} sample images...")
    
    # Split: 70% train, 20% val, 10% test
    train_count = int(num_samples * 0.7)
    val_count = int(num_samples * 0.2)
    test_count = num_samples - train_count - val_count
    
    splits = (
        ['train'] * train_count +
        ['val'] * val_count +
        ['test'] * test_count
    )
    
    random.shuffle(splits)
    
    # Create samples
    for i, split in enumerate(splits):
        # Random damage type
        damage_type = random.choice(list(damage_types.keys()))
        class_id = damage_types[damage_type]
        
        # Create image
        img_path = base_dir / 'images' / split / f'sample_{i:04d}.jpg'
        bbox = create_sample_image_with_damage(img_path, damage_type)
        
        # Create annotation
        label_path = base_dir / 'labels' / split / f'sample_{i:04d}.txt'
        create_yolo_annotation(bbox, class_id, label_path)
        
        if (i + 1) % 20 == 0:
            print(f"  Created {i + 1}/{num_samples} samples...")
    
    print(f"\n✅ Sample dataset created!")
    print(f"\nDataset structure:")
    print(f"  Train: {train_count} images")
    print(f"  Val: {val_count} images")
    print(f"  Test: {test_count} images")
    print(f"  Total: {num_samples} images")
    
    print(f"\nClasses: {len(damage_types)}")
    for damage_type, class_id in damage_types.items():
        print(f"  {class_id}: {damage_type}")
    
    print(f"\n📁 Dataset location: {base_dir}")
    
    # Create dataset YAML if it doesn't exist
    yaml_path = Path('car_damage.yaml')
    if not yaml_path.exists():
        print(f"\n📝 Creating dataset YAML...")
        
        with open(yaml_path, 'w') as f:
            f.write("# Car Damage Detection Dataset\n")
            f.write(f"path: {base_dir.absolute()}\n")
            f.write("train: images/train\n")
            f.write("val: images/val\n")
            f.write("test: images/test\n\n")
            f.write("# Classes\n")
            f.write("names:\n")
            for damage_type, class_id in damage_types.items():
                f.write(f"  {class_id}: {damage_type}\n")
        
        print(f"✅ Dataset YAML created: {yaml_path}")
    
    print("\n" + "=" * 80)
    print("  ✅ Sample Dataset Ready!")
    print("=" * 80)
    
    print("\nNext steps:")
    print("  1. Validate dataset: python validate_dataset.py")
    print("  2. Train model: python train.py")
    print("\nNote: This is a synthetic dataset for testing.")
    print("For production, use real car damage images.")


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Create sample dataset for testing')
    parser.add_argument('--samples', type=int, default=100,
                       help='Number of samples to create (default: 100)')
    
    args = parser.parse_args()
    
    create_sample_dataset(args.samples)


if __name__ == '__main__':
    main()
