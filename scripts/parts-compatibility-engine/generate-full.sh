#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     TORQ AI - Full Parts Compatibility Generator               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")"

echo "[1/3] Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
fi

echo ""
echo "[2/3] Criando diretório de output..."
mkdir -p output

echo ""
echo "[3/3] Executando gerador de compatibilidade..."
echo ""

node src/fullCompatibilityGenerator.js

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Processo concluído! Verifique a pasta output para os resultados."
echo "════════════════════════════════════════════════════════════════"
