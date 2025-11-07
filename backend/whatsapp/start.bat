@echo off
echo ╔══════════════════════════════════════════════════════════╗
echo ║  Iniciando WhatsApp Automation Backend                  ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Ativar ambiente virtual
call venv\Scripts\activate.bat

REM Iniciar servidor
python app.py
