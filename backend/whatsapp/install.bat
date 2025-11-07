@echo off
echo ╔══════════════════════════════════════════════════════════╗
echo ║  Instalação - WhatsApp Automation Backend               ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Python não encontrado. Por favor, instale Python 3.8 ou superior.
    pause
    exit /b 1
)

echo ✓ Python encontrado
python --version
echo.

REM Criar ambiente virtual
echo Criando ambiente virtual...
python -m venv venv

REM Ativar ambiente virtual
echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

REM Instalar dependências
echo Instalando dependências...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Criar arquivo .env se não existir
if not exist .env (
    echo Criando arquivo .env...
    copy .env.example .env
    echo ⚠️  IMPORTANTE: Edite o arquivo .env e configure SESSION_ENCRYPTION_KEY
)

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  Instalação concluída com sucesso!                       ║
echo ║                                                          ║
echo ║  Para iniciar o servidor:                               ║
echo ║  1. venv\Scripts\activate.bat                           ║
echo ║  2. python app.py                                       ║
echo ╚══════════════════════════════════════════════════════════╝
pause
