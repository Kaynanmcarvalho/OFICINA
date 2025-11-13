"""
Quick Test Script

Testa rapidamente o sistema YOLOv8 sem treinamento completo
Útil para verificar se tudo está funcionando

@author Torq AI Team
@version 1.0.0
"""

import os
import sys
from pathlib import Path
import numpy as np
from PIL import Image


def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 80)
    print(f"  {text}")
    print("=" * 80 + "\n")


def test_imports():
    """Test if all required packages are installed"""
    print("📦 Testando imports...")
    
    packages = {
        'ultralytics': 'YOLOv8',
        'fastapi': 'FastAPI',
        'uvicorn': 'Uvicorn',
        'PIL': 'Pillow',
        'numpy': 'NumPy',
        'cv2': 'OpenCV',
        'torch': 'PyTorch',
        'pandas': 'Pandas',
        'matplotlib': 'Matplotlib',
        'seaborn': 'Seaborn',
        'psutil': 'psutil',
        'requests': 'Requests',
        'yaml': 'PyYAML'
    }
    
    failed = []
    
    for package, name in packages.items():
        try:
            __import__(package)
            print(f"  ✅ {name}")
        except ImportError:
            print(f"  ❌ {name} (faltando)")
            failed.append(name)
    
    if failed:
        print(f"\n❌ Pacotes faltando: {', '.join(failed)}")
        print("Execute: pip install -r requirements.txt")
        return False
    
    print("\n✅ Todos os imports OK!")
    return True


def test_yolov8():
    """Test YOLOv8 basic functionality"""
    print("\n🤖 Testando YOLOv8...")
    
    try:
        from ultralytics import YOLO
        
        # Load model
        print("  Carregando modelo YOLOv8n...")
        model = YOLO('yolov8n.pt')
        print("  ✅ Modelo carregado")
        
        # Create dummy image
        print("  Criando imagem de teste...")
        dummy_img = np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8)
        
        # Run inference
        print("  Executando inferência...")
        results = model(dummy_img, verbose=False)
        print("  ✅ Inferência OK")
        
        # Check results
        detections = len(results[0].boxes) if results[0].boxes is not None else 0
        print(f"  ℹ️  Detecções: {detections}")
        
        print("\n✅ YOLOv8 funcionando!")
        return True
    
    except Exception as e:
        print(f"\n❌ Erro no YOLOv8: {e}")
        return False


def test_gpu():
    """Test GPU availability"""
    print("\n🖥️  Testando GPU...")
    
    try:
        import torch
        
        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name(0)
            gpu_count = torch.cuda.device_count()
            print(f"  ✅ GPU disponível: {gpu_name}")
            print(f"  ℹ️  {gpu_count} GPU(s) detectada(s)")
            
            # Test CUDA
            print("  Testando CUDA...")
            x = torch.rand(5, 3).cuda()
            print("  ✅ CUDA funcionando")
            
            return True
        else:
            print("  ℹ️  GPU não disponível (usando CPU)")
            return False
    
    except Exception as e:
        print(f"  ⚠️  Erro ao testar GPU: {e}")
        return False


def test_directories():
    """Test if required directories exist"""
    print("\n📁 Testando diretórios...")
    
    required_dirs = [
        'datasets',
        'runs',
        'exports',
        'benchmark_results',
        'model'
    ]
    
    missing = []
    
    for directory in required_dirs:
        path = Path(directory)
        if path.exists():
            print(f"  ✅ {directory}")
        else:
            print(f"  ❌ {directory} (faltando)")
            missing.append(directory)
    
    if missing:
        print(f"\n⚠️  Diretórios faltando: {', '.join(missing)}")
        print("Execute: python setup.py")
        return False
    
    print("\n✅ Todos os diretórios OK!")
    return True


def test_scripts():
    """Test if all scripts exist"""
    print("\n📄 Testando scripts...")
    
    required_scripts = [
        'detector.py',
        'train.py',
        'validate_dataset.py',
        'analyze_results.py',
        'export_model.py',
        'benchmark.py',
        'test_detector.py'
    ]
    
    missing = []
    
    for script in required_scripts:
        path = Path(script)
        if path.exists():
            print(f"  ✅ {script}")
        else:
            print(f"  ❌ {script} (faltando)")
            missing.append(script)
    
    if missing:
        print(f"\n❌ Scripts faltando: {', '.join(missing)}")
        return False
    
    print("\n✅ Todos os scripts OK!")
    return True


def test_inference_speed():
    """Test inference speed"""
    print("\n⚡ Testando velocidade de inferência...")
    
    try:
        from ultralytics import YOLO
        import time
        
        model = YOLO('yolov8n.pt')
        dummy_img = np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8)
        
        # Warm up
        print("  Aquecendo...")
        for _ in range(5):
            model(dummy_img, verbose=False)
        
        # Benchmark
        print("  Medindo velocidade...")
        times = []
        for _ in range(20):
            start = time.time()
            model(dummy_img, verbose=False)
            end = time.time()
            times.append((end - start) * 1000)
        
        mean_time = np.mean(times)
        fps = 1000 / mean_time
        
        print(f"\n  Tempo médio: {mean_time:.2f}ms")
        print(f"  FPS estimado: {fps:.1f}")
        
        if mean_time < 50:
            print("  🚀 Excelente! (Real-time capable)")
        elif mean_time < 100:
            print("  ✅ Bom! (Near real-time)")
        elif mean_time < 250:
            print("  🟡 Aceitável (Batch processing)")
        else:
            print("  🔴 Lento (Considere usar GPU)")
        
        return True
    
    except Exception as e:
        print(f"\n❌ Erro no teste de velocidade: {e}")
        return False


def test_api_imports():
    """Test API-related imports"""
    print("\n🌐 Testando imports da API...")
    
    try:
        from fastapi import FastAPI
        from uvicorn import run
        print("  ✅ FastAPI")
        print("  ✅ Uvicorn")
        
        print("\n✅ API imports OK!")
        return True
    
    except Exception as e:
        print(f"\n❌ Erro nos imports da API: {e}")
        return False


def print_summary(results):
    """Print test summary"""
    print("\n" + "=" * 80)
    print("  📊 Resumo dos Testes")
    print("=" * 80 + "\n")
    
    total = len(results)
    passed = sum(results.values())
    failed = total - passed
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} - {test_name}")
    
    print(f"\n  Total: {passed}/{total} testes passaram")
    
    if failed == 0:
        print("\n  🎉 Todos os testes passaram!")
        print("  ✅ Sistema pronto para uso!")
    else:
        print(f"\n  ⚠️  {failed} teste(s) falharam")
        print("  Execute: python setup.py")
    
    print("\n" + "=" * 80)


def main():
    """Main test function"""
    print_header("🧪 YOLOv8 Quick Test")
    
    results = {}
    
    # Run tests
    results['Imports'] = test_imports()
    results['Diretórios'] = test_directories()
    results['Scripts'] = test_scripts()
    results['YOLOv8'] = test_yolov8()
    results['GPU'] = test_gpu()
    results['Velocidade'] = test_inference_speed()
    results['API'] = test_api_imports()
    
    # Print summary
    print_summary(results)
    
    # Exit code
    if all(results.values()):
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == '__main__':
    main()
