#!/bin/bash

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Instalação - WhatsApp Automation Backend               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "✗ Python 3 não encontrado. Por favor, instale Python 3.8 ou superior."
    exit 1
fi

echo "✓ Python encontrado: $(python3 --version)"
echo ""

# Criar ambiente virtual
echo "Criando ambiente virtual..."
python3 -m venv venv

# Ativar ambiente virtual
echo "Ativando ambiente virtual..."
source venv/bin/activate

# Instalar dependências
echo "Instalando dependências..."
pip install --upgrade pip
pip install -r requirements.txt

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edite o arquivo .env e configure SESSION_ENCRYPTION_KEY"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Instalação concluída com sucesso!                       ║"
echo "║                                                          ║"
echo "║  Para iniciar o servidor:                               ║"
echo "║  1. source venv/bin/activate                            ║"
echo "║  2. python app.py                                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
