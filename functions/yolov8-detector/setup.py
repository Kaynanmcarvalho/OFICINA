"""
Setup Script - YOLOv8 Detector

Configura o ambiente completo para o sistema
Verifica dependências, cria diretórios e baixa modelos base

@author Torq AI Team
@version 1.0.0
"""

import os
import sys
from pathlib import Path
import subprocess


def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 80)
    print(f"  {text}")
    print("=" * 80 + "\n")


def check_python_version():
    """Check Python version"""
    print("🐍 Verificando versão do Python...")
    version = sys.version_info
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Python 3.8+ é necessário. Versão atual: {version.major}.{version.minor}")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True


def check_dependencies():
    """Check if required packages are installed"""
    print("\n📦 Verificando dependências...")
    
    required_packages = [
        'ultralytics',
        'fastapi',
        'uvicorn',
        'pillow',
        'numpy',
        'opencv-python',
        'torch',
        'pandas',
        'matplotlib',
        'seaborn',
        'psutil',
        'requests',
        'pyyaml'
    ]
    
    missing = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} (faltando)")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Pacotes faltando: {', '.join(missing)}")
        print("Execute: pip install -r requirements.txt")
        return False
    
    print("\n✅ Todas as dependências instaladas!")
    return True


def create_directories():
    """Create necessary directories"""
    print("\n📁 Criando estrutura de diretórios...")
    
    directories = [
        'datasets',
        'datasets/car-damage',
        'datasets/car-damage/images',
        'datasets/car-damage/images/train',
        'datasets/car-damage/images/val',
        'datasets/car-damage/images/test',
        'datasets/car-damage/labels',
        'datasets/car-damage/labels/train',
        'datasets/car-damage/labels/val',
        'datasets/car-damage/labels/test',
        'runs',
        'runs/train',
        'runs/detect',
        'runs/val',
        'exports',
        'benchmark_results',
        'model'
    ]
    
    for directory in directories:
        path = Path(directory)
        path.mkdir(parents=True, exist_ok=True)
        print(f"  ✅ {directory}")
    
    print("\n✅ Estrutura de diretórios criada!")
    return True


def download_base_model():
    """Download YOLOv8 base model"""
    print("\n⬇️  Baixando modelo base YOLOv8...")
    
    try:
        from ultralytics import YOLO
        
        # Download YOLOv8n (nano) - smallest and fastest
        print("  Baixando YOLOv8n (nano)...")
        model = YOLO('yolov8n.pt')
        print("  ✅ YOLOv8n baixado")
        
        # Optionally download other sizes
        print("\n  Modelos disponíveis:")
        print("    - yolov8n.pt (6.2MB) - Rápido, menor precisão")
        print("    - yolov8s.pt (22MB) - Balanceado (recomendado)")
        print("    - yolov8m.pt (52MB) - Alta precisão")
        print("    - yolov8l.pt (87MB) - Máxima precisão")
        
        print("\n✅ Modelo base baixado!")
        return True
    
    except Exception as e:
        print(f"❌ Erro ao baixar modelo: {e}")
        return False


def create_env_file():
    """Create .env file from example"""
    print("\n⚙️  Configurando arquivo .env...")
    
    env_example = Path('.env.example')
    env_file = Path('.env')
    
    if env_file.exists():
        print("  ℹ️  Arquivo .env já existe")
        return True
    
    if env_example.exists():
        import shutil
        shutil.copy(env_example, env_file)
        print("  ✅ Arquivo .env criado a partir de .env.example")
        print("  ℹ️  Edite .env para customizar configurações")
    else:
        print("  ⚠️  .env.example não encontrado")
    
    return True


def check_gpu():
    """Check if GPU is available"""
    print("\n🖥️  Verificando GPU...")
    
    try:
        import torch
        
        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name(0)
            gpu_count = torch.cuda.device_count()
            print(f"  ✅ GPU disponível: {gpu_name}")
            print(f"  ℹ️  {gpu_count} GPU(s) detectada(s)")
            print("  ⚡ Treinamento será MUITO mais rápido!")
            return True
        else:
            print("  ℹ️  GPU não disponível")
            print("  ℹ️  Treinamento usará CPU (mais lento)")
            return False
    
    except Exception as e:
        print(f"  ⚠️  Erro ao verificar GPU: {e}")
        return False


def verify_installation():
    """Verify YOLOv8 installation"""
    print("\n✅ Verificando instalação do YOLOv8...")
    
    try:
        from ultralytics import YOLO
        
        # Try to load a model
        model = YOLO('yolov8n.pt')
        print("  ✅ YOLOv8 funcionando corretamente!")
        
        # Print model info
        print(f"\n  Informações do modelo:")
        print(f"    - Tipo: {model.task}")
        print(f"    - Classes: {len(model.names)}")
        
        return True
    
    except Exception as e:
        print(f"  ❌ Erro na verificação: {e}")
        return False


def print_next_steps():
    """Print next steps"""
    print("\n" + "=" * 80)
    print("  🎉 Setup Completo!")
    print("=" * 80)
    
    print("\n📋 Próximos Passos:\n")
    
    print("1. Download de Datasets:")
    print("   Windows: download_datasets.bat")
    print("   Linux/Mac: ./download_datasets.sh\n")
    
    print("2. Validar Dataset:")
    print("   python validate_dataset.py\n")
    
    print("3. Treinar Modelo:")
    print("   python train.py\n")
    
    print("4. Analisar Resultados:")
    print("   python analyze_results.py\n")
    
    print("5. Exportar Modelo:")
    print("   python export_model.py --formats onnx\n")
    
    print("6. Fazer Benchmark:")
    print("   python benchmark.py\n")
    
    print("7. Testar Localmente:")
    print("   python detector.py\n")
    
    print("8. Deploy:")
    print("   docker build -t yolov8-detector .")
    print("   gcloud run deploy yolov8-detector --source .\n")
    
    print("📚 Documentação:")
    print("   - README.md - Documentação principal")
    print("   - TRAINING_WORKFLOW.md - Guia de treinamento")
    print("   - QUICK_COMMANDS.md - Comandos rápidos\n")
    
    print("=" * 80)


def main():
    """Main setup function"""
    print_header("🚀 YOLOv8 Car Damage Detector - Setup")
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        print("\n⚠️  Instale as dependências primeiro:")
        print("pip install -r requirements.txt")
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Download base model
    download_base_model()
    
    # Create .env file
    create_env_file()
    
    # Check GPU
    check_gpu()
    
    # Verify installation
    verify_installation()
    
    # Print next steps
    print_next_steps()


if __name__ == '__main__':
    main()
