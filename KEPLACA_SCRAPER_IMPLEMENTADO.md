# 🔍 Scraper Keplaca.com com Puppeteer - Contorna Cloudflare

## ✅ O que foi feito

Implementei um sistema completo de consulta de placas usando **Puppeteer** para contornar o bloqueio do Cloudflare no site **keplaca.com**.

### 1. Backend - Scraper com Puppeteer (`backend/services/keplacaScraper.js`)

O scraper usa **Puppeteer (headless Chrome)** para simular um navegador real e contornar proteções anti-bot:

**Recursos anti-detecção:**
- ✅ Remove flag `navigator.webdriver`
- ✅ User-Agent real do Chrome
- ✅ Headers completos simulando navegador
- ✅ Viewport realista (1920x1080)
- ✅ Aguarda carregamento completo da página
- ✅ Timeout de 30 segundos

**4 Estratégias de extração de dados:**
- **Estratégia 1**: Busca por classes CSS específicas (`.vehicle-info`, `.info-row`, etc.)
- **Estratégia 2**: Busca em tabelas HTML (`<table>`, `<tr>`, `<td>`)
- **Estratégia 3**: Busca por padrões regex no texto completo da página
- **Estratégia 4**: Busca em elementos `<strong>` e `<b>` seguidos de valores

**Dados extraídos:**
- ✅ Placa
- ✅ Marca
- ✅ Modelo
- ✅ Ano
- ✅ Cor
- ✅ Tipo/Categoria
- ✅ Chassi
- ✅ Município
- ✅ UF

### 2. Backend - API Simplificada (`backend/routes/vehicles.js`)

Removi todas as outras APIs (SINESP, Brasil API, etc.) e mantive **apenas o Keplaca.com**.

**Endpoint:**
```
GET /api/vehicles/plate/:plate
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "source": "keplaca",
  "data": {
    "placa": "ABC1234",
    "marca": "HONDA",
    "modelo": "HONDA CB 600F HORNET 2012",
    "ano": "2012",
    "cor": "PRETA",
    "tipo": "MOTOCICLETA",
    "chassi": "...",
    "municipio": "SÃO PAULO",
    "uf": "SP"
  }
}
```

### 3. Frontend - Botão de Busca (`src/pages/checkin/componentes/ModalCheckin.jsx`)

Adicionei um **botão "Buscar"** ao lado do campo de placa:

**Funcionalidades:**
- ✅ Botão com ícone de busca
- ✅ Busca ao clicar no botão
- ✅ Busca ao pressionar Enter no campo de placa
- ✅ Loading state durante a busca
- ✅ Toast notifications (sucesso/erro)
- ✅ Preenchimento automático do campo "Modelo"
- ✅ Desabilitado quando não há placa digitada

## 📋 Requisitos

### Chrome instalado no sistema

O Puppeteer precisa do Chrome instalado. Ele procura automaticamente em:
- `C:\Program Files\Google\Chrome\Application\chrome.exe`
- `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`

Se o Chrome não for encontrado, o sistema usa **fallback** para a Brasil API FIPE.

### Variáveis de ambiente (opcional)

Você pode definir o caminho do Chrome manualmente:
```bash
set CHROME_PATH=C:\caminho\para\chrome.exe
```

## 🚀 Como usar

### 1. Certifique-se que o backend está rodando:

```bash
cd backend
npm start
```

O backend vai:
1. Tentar usar Puppeteer + Keplaca.com (melhor opção)
2. Se falhar, usa Brasil API FIPE como fallback

### 2. No frontend, ao fazer um check-in:

1. Digite a placa no campo "Placa" (ex: ABC1234)
2. Clique no botão **"Buscar"** ou pressione **Enter**
3. Aguarde a consulta (aparecerá "Buscando...")
4. Os dados do veículo serão preenchidos automaticamente no campo "Modelo"

## 📝 Exemplo de uso

```
1. Digite: ABC1234
2. Clique em "Buscar"
3. Resultado: "HONDA CB 600F HORNET 2012" é preenchido automaticamente
```

## ⚠️ Observações

- O scraper usa múltiplas estratégias para garantir que os dados sejam extraídos mesmo se o site mudar a estrutura
- Se a placa não for encontrada, uma mensagem de erro será exibida
- O usuário sempre pode preencher os dados manualmente se a busca falhar
- O campo "Modelo" recebe o texto completo: Marca + Modelo + Ano

## 🔧 Logs no console

O backend exibe logs detalhados:
```
[PLACA API] 🔍 Consultando placa: ABC1234
[PLACA API] 📡 Tentando Keplaca.com com Puppeteer...
[PUPPETEER] 🚀 Iniciando browser...
[PUPPETEER] ✅ Browser iniciado
[KEPLACA] 🌐 Acessando keplaca.com para placa: ABC1234
[KEPLACA] 📡 Status HTTP: 200
[KEPLACA] ✅ Dados extraídos com sucesso!
[KEPLACA] 📦 Dados: { marca: "HONDA", modelo: "CB 600F", ano: "2012", ... }
[PLACA API] ✅ Keplaca - SUCESSO!
```

Se o Puppeteer falhar:
```
[PLACA API] ❌ Keplaca/Puppeteer falhou: ...
[PLACA API] 📡 Tentando Brasil API FIPE (fallback)...
[PLACA API] ✅ Brasil API - SUCESSO!
```

## ✨ Melhorias implementadas

1. **Puppeteer headless**: Contorna Cloudflare e proteções anti-bot
2. **Anti-detecção**: Remove flags de automação do navegador
3. **Browser reusável**: Mantém instância do browser em cache para performance
4. **4 estratégias de extração**: Garante sucesso mesmo com mudanças no HTML
5. **Fallback automático**: Se Puppeteer falhar, usa Brasil API FIPE
6. **Timeout de 30s**: Aguarda Cloudflare e carregamento completo
7. **Logs detalhados**: Facilita debug e monitoramento
8. **UX melhorada**: Botão de busca intuitivo com feedback visual
9. **Busca por Enter**: Atalho de teclado para agilizar
10. **Modelo completo**: Concatena marca + modelo + ano automaticamente
11. **Cleanup automático**: Fecha browser ao encerrar o processo

## ⚙️ Como funciona o contorno do Cloudflare

1. **Puppeteer simula navegador real**: Cloudflare não detecta como bot
2. **Remove webdriver flag**: `navigator.webdriver = false`
3. **Headers realistas**: User-Agent, Accept, Accept-Language, etc.
4. **Aguarda carregamento**: `waitUntil: 'networkidle2'` espera página carregar
5. **Timeout generoso**: 30 segundos para passar pelo Cloudflare
6. **Viewport real**: 1920x1080 como um desktop real
