"""
YOLOv8 Training Script for Car Damage Detection

Treina modelo YOLOv8 para detectar danos em veículos
Usa datasets públicos do Kaggle e Roboflow

@author Torq AI Team
@version 1.0.0
"""

import os
import sys
import yaml
import torch
from pathlib import Path
from ultralytics import YOLO
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Configuration
CONFIG = {
    'model': 'yolov8n.pt',  # nano model for speed (can use yolov8s.pt for better accuracy)
    'epochs': 200,
    'imgsz': 640,
    'batch': 16,
    'device': 'cuda' if torch.cuda.is_available() else 'cpu',
    'patience': 30,
    'save_period': 10,
    'project': 'runs/train',
    'name': 'car_damage_detector',
    'exist_ok': True,
    'pretrained': True,
    'optimizer': 'AdamW',
    'lr0': 0.01,
    'lrf': 0.01,
    'momentum': 0.937,
    'weight_decay': 0.0005,
    'warmup_epochs': 3.0,
    'warmup_momentum': 0.8,
    'warmup_bias_lr': 0.1,
    'box': 7.5,
    'cls': 0.5,
    'dfl': 1.5,
    'pose': 12.0,
    'kobj': 1.0,
    'label_smoothing': 0.0,
    'nbs': 64,
    'hsv_h': 0.015,
    'hsv_s': 0.7,
    'hsv_v': 0.4,
    'degrees': 10.0,
    'translate': 0.1,
    'scale': 0.5,
    'shear': 0.0,
    'perspective': 0.0,
    'flipud': 0.0,
    'fliplr': 0.5,
    'mosaic': 1.0,
    'mixup': 0.0,
    'copy_paste': 0.0,
}

# Damage classes
DAMAGE_CLASSES = {
    0: 'broken_glass',
    1: 'broken_light',
    2: 'bumper_damage',
    3: 'dent',
    4: 'scratch',
    5: 'rust',
    6: 'paint_damage',
    7: 'flat_tire',
    8: 'tire_wear',
    9: 'mirror_damage',
    10: 'door_damage',
    11: 'hood_damage',
    12: 'trunk_damage',
    13: 'wheel_damage',
}


def check_environment():
    """Check if environment is ready for training"""
    print("=" * 60)
    print("🔍 Checking Environment")
    print("=" * 60)
    
    # Check Python version
    print(f"Python version: {sys.version}")
    
    # Check PyTorch
    print(f"PyTorch version: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"CUDA version: {torch.version.cuda}")
        print(f"GPU: {torch.cuda.get_device_name(0)}")
        print(f"GPU memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    
    # Check dataset
    data_yaml = Path('car_damage.yaml')
    if not data_yaml.exists():
        print(f"\n❌ Dataset config not found: {data_yaml}")
        print("Please create car_damage.yaml with dataset paths")
        return False
    
    print(f"\n✅ Dataset config found: {data_yaml}")
    
    # Check if dataset directories exist
    with open(data_yaml, 'r') as f:
        data_config = yaml.safe_load(f)
    
    dataset_path = Path(data_config.get('path', '.'))
    train_path = dataset_path / data_config.get('train', 'images/train')
    val_path = dataset_path / data_config.get('val', 'images/val')
    
    if not train_path.exists():
        print(f"❌ Training images not found: {train_path}")
        return False
    
    if not val_path.exists():
        print(f"❌ Validation images not found: {val_path}")
        return False
    
    # Count images
    train_images = list(train_path.glob('*.jpg')) + list(train_path.glob('*.png'))
    val_images = list(val_path.glob('*.jpg')) + list(val_path.glob('*.png'))
    
    print(f"✅ Training images: {len(train_images)}")
    print(f"✅ Validation images: {len(val_images)}")
    
    if len(train_images) < 100:
        print(f"\n⚠️  Warning: Only {len(train_images)} training images found")
        print("Recommended: at least 500 images per class")
    
    print("\n✅ Environment check passed!")
    return True


def create_dataset_yaml():
    """Create dataset YAML if it doesn't exist"""
    yaml_path = Path('car_damage.yaml')
    
    if yaml_path.exists():
        print(f"✅ Dataset config already exists: {yaml_path}")
        return
    
    print("📝 Creating dataset config...")
    
    dataset_config = {
        'path': './datasets/car-damage',
        'train': 'images/train',
        'val': 'images/val',
        'test': 'images/test',
        'names': DAMAGE_CLASSES,
        'nc': len(DAMAGE_CLASSES),
    }
    
    with open(yaml_path, 'w') as f:
        yaml.dump(dataset_config, f, default_flow_style=False)
    
    print(f"✅ Created: {yaml_path}")
    print("\n⚠️  Please update the paths in car_damage.yaml to match your dataset location")


def train_model():
    """Train YOLOv8 model"""
    print("\n" + "=" * 60)
    print("🚀 Starting Training")
    print("=" * 60)
    
    # Load model
    print(f"\n📦 Loading model: {CONFIG['model']}")
    model = YOLO(CONFIG['model'])
    
    # Print model info
    print(f"✅ Model loaded successfully")
    print(f"Device: {CONFIG['device']}")
    print(f"Epochs: {CONFIG['epochs']}")
    print(f"Batch size: {CONFIG['batch']}")
    print(f"Image size: {CONFIG['imgsz']}")
    
    # Start training
    print(f"\n🏋️  Training started at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("This may take several hours depending on your hardware...")
    
    try:
        results = model.train(
            data='car_damage.yaml',
            epochs=CONFIG['epochs'],
            imgsz=CONFIG['imgsz'],
            batch=CONFIG['batch'],
            device=CONFIG['device'],
            patience=CONFIG['patience'],
            save_period=CONFIG['save_period'],
            project=CONFIG['project'],
            name=CONFIG['name'],
            exist_ok=CONFIG['exist_ok'],
            pretrained=CONFIG['pretrained'],
            optimizer=CONFIG['optimizer'],
            lr0=CONFIG['lr0'],
            lrf=CONFIG['lrf'],
            momentum=CONFIG['momentum'],
            weight_decay=CONFIG['weight_decay'],
            warmup_epochs=CONFIG['warmup_epochs'],
            warmup_momentum=CONFIG['warmup_momentum'],
            warmup_bias_lr=CONFIG['warmup_bias_lr'],
            box=CONFIG['box'],
            cls=CONFIG['cls'],
            dfl=CONFIG['dfl'],
            hsv_h=CONFIG['hsv_h'],
            hsv_s=CONFIG['hsv_s'],
            hsv_v=CONFIG['hsv_v'],
            degrees=CONFIG['degrees'],
            translate=CONFIG['translate'],
            scale=CONFIG['scale'],
            shear=CONFIG['shear'],
            perspective=CONFIG['perspective'],
            flipud=CONFIG['flipud'],
            fliplr=CONFIG['fliplr'],
            mosaic=CONFIG['mosaic'],
            mixup=CONFIG['mixup'],
            copy_paste=CONFIG['copy_paste'],
            verbose=True,
            seed=42,
            deterministic=True,
            single_cls=False,
            rect=False,
            cos_lr=False,
            close_mosaic=10,
            amp=True,
            fraction=1.0,
            profile=False,
            freeze=None,
            multi_scale=False,
            overlap_mask=True,
            mask_ratio=4,
            dropout=0.0,
            val=True,
            split='val',
            save_json=False,
            save_hybrid=False,
            conf=None,
            iou=0.7,
            max_det=300,
            half=False,
            dnn=False,
            plots=True,
        )
        
        print(f"\n✅ Training completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        return results
        
    except Exception as e:
        print(f"\n❌ Training failed: {e}")
        raise


def validate_model():
    """Validate trained model"""
    print("\n" + "=" * 60)
    print("📊 Validating Model")
    print("=" * 60)
    
    # Load best model
    best_model_path = Path(CONFIG['project']) / CONFIG['name'] / 'weights' / 'best.pt'
    
    if not best_model_path.exists():
        print(f"❌ Best model not found: {best_model_path}")
        return None
    
    print(f"📦 Loading best model: {best_model_path}")
    model = YOLO(str(best_model_path))
    
    # Validate
    print("🔍 Running validation...")
    metrics = model.val(data='car_damage.yaml', split='test')
    
    # Print metrics
    print("\n" + "=" * 60)
    print("📈 Validation Metrics")
    print("=" * 60)
    print(f"mAP50: {metrics.box.map50:.4f}")
    print(f"mAP50-95: {metrics.box.map:.4f}")
    print(f"Precision: {metrics.box.mp:.4f}")
    print(f"Recall: {metrics.box.mr:.4f}")
    
    # Per-class metrics
    print("\n📋 Per-Class Metrics:")
    print("-" * 60)
    for i, (name, ap) in enumerate(zip(metrics.names.values(), metrics.box.ap)):
        print(f"{name:20s}: mAP50={ap:.4f}")
    
    # Check if meets requirements
    print("\n" + "=" * 60)
    print("✅ Quality Check")
    print("=" * 60)
    
    target_map50 = 0.85
    target_precision = 0.80
    target_recall = 0.75
    
    passed = True
    
    if metrics.box.map50 >= target_map50:
        print(f"✅ mAP50: {metrics.box.map50:.4f} (target: {target_map50})")
    else:
        print(f"❌ mAP50: {metrics.box.map50:.4f} (target: {target_map50})")
        passed = False
    
    if metrics.box.mp >= target_precision:
        print(f"✅ Precision: {metrics.box.mp:.4f} (target: {target_precision})")
    else:
        print(f"⚠️  Precision: {metrics.box.mp:.4f} (target: {target_precision})")
    
    if metrics.box.mr >= target_recall:
        print(f"✅ Recall: {metrics.box.mr:.4f} (target: {target_recall})")
    else:
        print(f"⚠️  Recall: {metrics.box.mr:.4f} (target: {target_recall})")
    
    if passed:
        print("\n🎉 Model meets quality requirements!")
    else:
        print("\n⚠️  Model needs improvement. Consider:")
        print("   - More training data")
        print("   - More epochs")
        print("   - Better data augmentation")
        print("   - Larger model (yolov8s or yolov8m)")
    
    return metrics


def export_model():
    """Export model to different formats"""
    print("\n" + "=" * 60)
    print("📦 Exporting Model")
    print("=" * 60)
    
    best_model_path = Path(CONFIG['project']) / CONFIG['name'] / 'weights' / 'best.pt'
    
    if not best_model_path.exists():
        print(f"❌ Best model not found: {best_model_path}")
        return
    
    print(f"📦 Loading model: {best_model_path}")
    model = YOLO(str(best_model_path))
    
    # Export to ONNX (faster CPU inference)
    print("\n🔄 Exporting to ONNX...")
    try:
        model.export(format='onnx', simplify=True)
        print("✅ ONNX export successful")
    except Exception as e:
        print(f"❌ ONNX export failed: {e}")
    
    # Copy best model to model directory
    model_dir = Path('model')
    model_dir.mkdir(exist_ok=True)
    
    import shutil
    dest_path = model_dir / 'best.pt'
    shutil.copy(best_model_path, dest_path)
    print(f"\n✅ Model copied to: {dest_path}")


def generate_report():
    """Generate training report"""
    print("\n" + "=" * 60)
    print("📄 Generating Report")
    print("=" * 60)
    
    results_dir = Path(CONFIG['project']) / CONFIG['name']
    
    if not results_dir.exists():
        print(f"❌ Results directory not found: {results_dir}")
        return
    
    # Create report
    report_path = results_dir / 'TRAINING_REPORT.md'
    
    with open(report_path, 'w') as f:
        f.write("# YOLOv8 Car Damage Detection - Training Report\n\n")
        f.write(f"**Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write("## Configuration\n\n")
        f.write(f"- Model: {CONFIG['model']}\n")
        f.write(f"- Epochs: {CONFIG['epochs']}\n")
        f.write(f"- Batch size: {CONFIG['batch']}\n")
        f.write(f"- Image size: {CONFIG['imgsz']}\n")
        f.write(f"- Device: {CONFIG['device']}\n\n")
        f.write("## Classes\n\n")
        for i, name in DAMAGE_CLASSES.items():
            f.write(f"{i}. {name}\n")
        f.write("\n## Results\n\n")
        f.write("See `results.png` for training curves\n")
        f.write("See `confusion_matrix.png` for confusion matrix\n")
        f.write("See `val_batch0_pred.jpg` for sample predictions\n\n")
        f.write("## Files\n\n")
        f.write("- `weights/best.pt` - Best model weights\n")
        f.write("- `weights/last.pt` - Last epoch weights\n")
        f.write("- `results.csv` - Training metrics\n")
    
    print(f"✅ Report generated: {report_path}")


def main():
    """Main training pipeline"""
    print("\n" + "=" * 80)
    print("🤖 YOLOv8 Car Damage Detection - Training Pipeline")
    print("=" * 80)
    
    # Step 1: Check environment
    if not check_environment():
        print("\n❌ Environment check failed. Please fix issues and try again.")
        return
    
    # Step 2: Create dataset config if needed
    create_dataset_yaml()
    
    # Step 3: Train model
    try:
        results = train_model()
    except Exception as e:
        print(f"\n❌ Training failed: {e}")
        return
    
    # Step 4: Validate model
    try:
        metrics = validate_model()
    except Exception as e:
        print(f"\n⚠️  Validation failed: {e}")
        metrics = None
    
    # Step 5: Export model
    try:
        export_model()
    except Exception as e:
        print(f"\n⚠️  Export failed: {e}")
    
    # Step 6: Generate report
    try:
        generate_report()
    except Exception as e:
        print(f"\n⚠️  Report generation failed: {e}")
    
    # Final summary
    print("\n" + "=" * 80)
    print("🎉 Training Pipeline Completed!")
    print("=" * 80)
    print(f"\n📁 Results saved to: {Path(CONFIG['project']) / CONFIG['name']}")
    print(f"📦 Best model: {Path(CONFIG['project']) / CONFIG['name'] / 'weights' / 'best.pt'}")
    print(f"📊 Metrics: {Path(CONFIG['project']) / CONFIG['name'] / 'results.csv'}")
    print("\n🚀 Next steps:")
    print("   1. Review training curves in results.png")
    print("   2. Check confusion matrix")
    print("   3. Test model with sample images")
    print("   4. Deploy to Cloud Run")
    print("\n✅ Done!")


if __name__ == '__main__':
    main()
