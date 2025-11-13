"""
Model Export Script

Exporta modelo YOLOv8 para diferentes formatos de produção
Suporta: ONNX, TensorRT, CoreML, TFLite, OpenVINO

@author Torq AI Team
@version 1.0.0
"""

import os
from pathlib import Path
from ultralytics import YOLO
import argparse
import json
from datetime import datetime


def export_to_onnx(model, export_dir, optimize=True):
    """Export model to ONNX format"""
    print("\n" + "=" * 60)
    print("📦 Exporting to ONNX")
    print("=" * 60)
    
    try:
        # Export with optimization
        model.export(
            format='onnx',
            dynamic=True,  # Dynamic input shapes
            simplify=optimize,  # Simplify model
            opset=12  # ONNX opset version
        )
        
        onnx_path = export_dir / 'best.onnx'
        print(f"✅ ONNX export successful: {onnx_path}")
        
        # Get file size
        size_mb = onnx_path.stat().st_size / (1024 * 1024)
        print(f"📊 Model size: {size_mb:.2f} MB")
        
        return str(onnx_path)
    
    except Exception as e:
        print(f"❌ ONNX export failed: {e}")
        return None


def export_to_tensorrt(model, export_dir):
    """Export model to TensorRT format"""
    print("\n" + "=" * 60)
    print("🚀 Exporting to TensorRT")
    print("=" * 60)
    
    try:
        # Requires NVIDIA GPU and TensorRT installed
        model.export(
            format='engine',
            half=True,  # FP16 precision
            workspace=4  # Max workspace size in GB
        )
        
        engine_path = export_dir / 'best.engine'
        print(f"✅ TensorRT export successful: {engine_path}")
        
        size_mb = engine_path.stat().st_size / (1024 * 1024)
        print(f"📊 Model size: {size_mb:.2f} MB")
        print("⚡ Expected speedup: 2-5x faster than ONNX")
        
        return str(engine_path)
    
    except Exception as e:
        print(f"❌ TensorRT export failed: {e}")
        print("💡 TensorRT requires NVIDIA GPU and TensorRT installation")
        return None


def export_to_coreml(model, export_dir):
    """Export model to CoreML format (iOS/macOS)"""
    print("\n" + "=" * 60)
    print("🍎 Exporting to CoreML")
    print("=" * 60)
    
    try:
        model.export(
            format='coreml',
            nms=True  # Include NMS in model
        )
        
        coreml_path = export_dir / 'best.mlpackage'
        print(f"✅ CoreML export successful: {coreml_path}")
        print("📱 Ready for iOS/macOS deployment")
        
        return str(coreml_path)
    
    except Exception as e:
        print(f"❌ CoreML export failed: {e}")
        print("💡 CoreML export works best on macOS")
        return None


def export_to_tflite(model, export_dir):
    """Export model to TensorFlow Lite format"""
    print("\n" + "=" * 60)
    print("📱 Exporting to TFLite")
    print("=" * 60)
    
    try:
        model.export(
            format='tflite',
            int8=False  # Use FP16 quantization
        )
        
        tflite_path = export_dir / 'best_saved_model' / 'best_float16.tflite'
        print(f"✅ TFLite export successful: {tflite_path}")
        
        if tflite_path.exists():
            size_mb = tflite_path.stat().st_size / (1024 * 1024)
            print(f"📊 Model size: {size_mb:.2f} MB")
        
        print("📱 Ready for Android/Edge deployment")
        
        return str(tflite_path)
    
    except Exception as e:
        print(f"❌ TFLite export failed: {e}")
        return None


def export_to_openvino(model, export_dir):
    """Export model to OpenVINO format"""
    print("\n" + "=" * 60)
    print("🔧 Exporting to OpenVINO")
    print("=" * 60)
    
    try:
        model.export(
            format='openvino',
            half=True  # FP16 precision
        )
        
        openvino_path = export_dir / 'best_openvino_model'
        print(f"✅ OpenVINO export successful: {openvino_path}")
        print("💻 Optimized for Intel CPUs/GPUs")
        
        return str(openvino_path)
    
    except Exception as e:
        print(f"❌ OpenVINO export failed: {e}")
        return None


def create_deployment_package(export_dir, exports, model_info):
    """Create deployment package with all exports"""
    print("\n" + "=" * 60)
    print("📦 Creating Deployment Package")
    print("=" * 60)
    
    # Create deployment info
    deployment_info = {
        'model_name': 'car_damage_detector',
        'version': '1.0.0',
        'export_date': datetime.now().isoformat(),
        'model_info': model_info,
        'exports': exports,
        'usage': {
            'onnx': 'General purpose, cross-platform',
            'tensorrt': 'NVIDIA GPUs, maximum performance',
            'coreml': 'iOS/macOS applications',
            'tflite': 'Android/Edge devices',
            'openvino': 'Intel CPUs/GPUs'
        },
        'deployment_notes': [
            'ONNX is recommended for most production deployments',
            'TensorRT provides best performance on NVIDIA GPUs',
            'CoreML for native iOS/macOS apps',
            'TFLite for mobile and edge devices',
            'OpenVINO for Intel hardware optimization'
        ]
    }
    
    # Save deployment info
    info_path = export_dir / 'deployment_info.json'
    with open(info_path, 'w') as f:
        json.dump(deployment_info, f, indent=2)
    
    print(f"✅ Deployment info saved: {info_path}")
    
    # Create README
    readme_path = export_dir / 'DEPLOYMENT_README.md'
    with open(readme_path, 'w') as f:
        f.write("# Car Damage Detector - Deployment Package\n\n")
        f.write(f"**Version**: {deployment_info['version']}\n")
        f.write(f"**Export Date**: {deployment_info['export_date']}\n\n")
        
        f.write("## Available Formats\n\n")
        for format_name, path in exports.items():
            if path:
                f.write(f"### {format_name.upper()}\n")
                f.write(f"- **Path**: `{Path(path).name}`\n")
                f.write(f"- **Use Case**: {deployment_info['usage'].get(format_name, 'N/A')}\n\n")
        
        f.write("## Quick Start\n\n")
        f.write("### ONNX Runtime (Python)\n")
        f.write("```python\n")
        f.write("import onnxruntime as ort\n")
        f.write("import numpy as np\n\n")
        f.write("# Load model\n")
        f.write("session = ort.InferenceSession('best.onnx')\n\n")
        f.write("# Run inference\n")
        f.write("input_name = session.get_inputs()[0].name\n")
        f.write("output = session.run(None, {input_name: image_array})\n")
        f.write("```\n\n")
        
        f.write("### TensorRT (Python)\n")
        f.write("```python\n")
        f.write("from ultralytics import YOLO\n\n")
        f.write("# Load TensorRT model\n")
        f.write("model = YOLO('best.engine')\n\n")
        f.write("# Run inference\n")
        f.write("results = model('image.jpg')\n")
        f.write("```\n\n")
        
        f.write("## Deployment Notes\n\n")
        for note in deployment_info['deployment_notes']:
            f.write(f"- {note}\n")
        
        f.write("\n## Model Information\n\n")
        f.write(f"- **Input Size**: {model_info.get('imgsz', 'N/A')}\n")
        f.write(f"- **Classes**: {model_info.get('names', 'N/A')}\n")
        f.write(f"- **Task**: {model_info.get('task', 'N/A')}\n")
    
    print(f"✅ Deployment README saved: {readme_path}")
    
    print("\n📦 Deployment package ready!")
    print(f"Location: {export_dir}")


def main():
    """Main export pipeline"""
    parser = argparse.ArgumentParser(description='Export YOLOv8 model to production formats')
    parser.add_argument('--model', type=str, default='runs/train/car_damage_detector/weights/best.pt',
                       help='Path to trained model')
    parser.add_argument('--formats', type=str, nargs='+', 
                       default=['onnx'],
                       choices=['onnx', 'tensorrt', 'coreml', 'tflite', 'openvino', 'all'],
                       help='Export formats')
    parser.add_argument('--output', type=str, default='exports',
                       help='Output directory for exports')
    
    args = parser.parse_args()
    
    print("\n" + "=" * 80)
    print("🚀 YOLOv8 Model Export Pipeline")
    print("=" * 80)
    
    # Check if model exists
    model_path = Path(args.model)
    if not model_path.exists():
        print(f"❌ Model not found: {model_path}")
        print("Please train the model first: python train.py")
        return
    
    # Load model
    print(f"\n📥 Loading model: {model_path}")
    model = YOLO(str(model_path))
    
    # Get model info
    model_info = {
        'imgsz': model.overrides.get('imgsz', 640),
        'names': model.names,
        'task': model.task
    }
    
    print(f"✅ Model loaded successfully")
    print(f"Classes: {list(model_info['names'].values())}")
    
    # Create export directory
    export_dir = Path(args.output)
    export_dir.mkdir(exist_ok=True)
    
    # Determine formats to export
    formats = args.formats
    if 'all' in formats:
        formats = ['onnx', 'tensorrt', 'coreml', 'tflite', 'openvino']
    
    print(f"\n📋 Exporting to formats: {', '.join(formats)}")
    
    # Export to each format
    exports = {}
    
    if 'onnx' in formats:
        exports['onnx'] = export_to_onnx(model, export_dir)
    
    if 'tensorrt' in formats:
        exports['tensorrt'] = export_to_tensorrt(model, export_dir)
    
    if 'coreml' in formats:
        exports['coreml'] = export_to_coreml(model, export_dir)
    
    if 'tflite' in formats:
        exports['tflite'] = export_to_tflite(model, export_dir)
    
    if 'openvino' in formats:
        exports['openvino'] = export_to_openvino(model, export_dir)
    
    # Create deployment package
    create_deployment_package(export_dir, exports, model_info)
    
    # Summary
    print("\n" + "=" * 80)
    print("✅ Export Complete!")
    print("=" * 80)
    
    successful_exports = [fmt for fmt, path in exports.items() if path]
    failed_exports = [fmt for fmt, path in exports.items() if not path]
    
    if successful_exports:
        print(f"\n✅ Successful exports: {', '.join(successful_exports)}")
    
    if failed_exports:
        print(f"\n⚠️  Failed exports: {', '.join(failed_exports)}")
    
    print(f"\n📦 All exports saved in: {export_dir}")
    print("\nNext steps:")
    print("1. Review deployment_info.json for export details")
    print("2. Read DEPLOYMENT_README.md for usage instructions")
    print("3. Test exported models in your target environment")
    print("4. Deploy to production!")


if __name__ == '__main__':
    main()
