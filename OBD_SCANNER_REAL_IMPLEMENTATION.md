# 🔧 Scanner OBD-II Real - Implementação Completa

## 📋 Visão Geral

Sistema completo de diagnóstico OBD-II real para o TORQ, substituindo dados simulados por comunicação real com scanner físico ELM327.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  OBDScannerModal.jsx                                     │    │
│  │  - Interface do usuário                                  │    │
│  │  - Seleção de conexão (USB/Wi-Fi)                       │    │
│  │  - Exibição de resultados                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  obdApiService.js                                        │    │
│  │  - Comunicação HTTP com backend                          │    │
│  │  - Server-Sent Events para progresso                     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (Node.js)                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  routes/obd.js                                           │    │
│  │  - POST /api/obd/connect                                 │    │
│  │  - GET  /api/obd/scan/quick                              │    │
│  │  - GET  /api/obd/scan/full                               │    │
│  │  - GET  /api/obd/status                                  │    │
│  │  - POST /api/obd/disconnect                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  services/obdService.js                                  │    │
│  │  - Comunicação serial (USB/Bluetooth)                    │    │
│  │  - Comunicação Wi-Fi (TCP Socket)                        │    │
│  │  - Comandos ELM327/OBD-II                                │    │
│  │  - Parsing de respostas                                  │    │
│  │  - Banco de dados de DTCs                                │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Serial/TCP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HARDWARE (ELM327)                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Scanner OBD-II                                          │    │
│  │  - USB: COM3, /dev/ttyUSB0                               │    │
│  │  - Bluetooth: Pareado como porta serial                  │    │
│  │  - Wi-Fi: 192.168.0.10:35000                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              │ OBD-II Protocol                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ECU do Veículo                                          │    │
│  │  - Porta OBD-II (conector de 16 pinos)                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## 🔌 Hardware Suportado

### Scanners ELM327 Compatíveis
- **USB**: Qualquer ELM327 USB (recomendado para estabilidade)
- **Bluetooth**: ELM327 Bluetooth (pareado como porta serial)
- **Wi-Fi**: ELM327 Wi-Fi (IP padrão: 192.168.0.10, porta: 35000)

### Marcas Testadas
- Vgate iCar Pro
- KONNWEI KW903
- Veepeak OBDCheck
- Generic ELM327 v2.1

## 📡 API Endpoints

### `GET /api/obd/status`
Retorna status atual da conexão.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "isConnected": true,
    "connectionType": "serial",
    "device": {
      "type": "serial",
      "port": "COM3",
      "version": "ELM327 v2.1",
      "protocol": "ISO 15765-4 CAN"
    }
  }
}
```

### `GET /api/obd/ports`
Lista portas seriais disponíveis.

**Resposta:**
```json
{
  "success": true,
  "ports": [
    {
      "path": "COM3",
      "manufacturer": "FTDI",
      "friendlyName": "USB Serial Port (COM3)"
    }
  ]
}
```

### `POST /api/obd/connect`
Conecta ao scanner OBD-II.

**Body (Serial):**
```json
{
  "type": "serial",
  "port": "COM3"
}
```

**Body (Wi-Fi):**
```json
{
  "type": "wifi",
  "host": "192.168.0.10",
  "tcpPort": 35000
}
```

### `GET /api/obd/scan/quick`
Executa scan rápido (dados básicos).

**Resposta:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-01-02T10:30:00.000Z",
    "type": "quick",
    "healthScore": 85,
    "healthStatus": "Bom",
    "milStatus": {
      "milOn": false,
      "dtcCount": 0
    },
    "liveData": [
      { "param": "RPM", "value": 850, "unit": "rpm", "status": "normal" },
      { "param": "Temp. Motor", "value": 92, "unit": "°C", "status": "normal" },
      { "param": "Velocidade", "value": 0, "unit": "km/h", "status": "normal" },
      { "param": "Tensão Bateria", "value": 14.2, "unit": "V", "status": "normal" }
    ]
  }
}
```

### `GET /api/obd/scan/full`
Executa scan completo (DTCs + sensores + VIN).

**Resposta:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-01-02T10:30:00.000Z",
    "type": "full",
    "healthScore": 65,
    "healthStatus": "Regular",
    "vehicleInfo": {
      "vin": "9BWHE21JX24060831"
    },
    "milStatus": {
      "milOn": true,
      "dtcCount": 2
    },
    "dtcCodes": [
      {
        "code": "P0171",
        "description": "Sistema muito pobre (Banco 1)",
        "severity": "warning",
        "system": "Combustível",
        "causes": ["Filtro de ar sujo", "Vazamento de vácuo"],
        "estimatedCost": [150, 500]
      },
      {
        "code": "P0420",
        "description": "Eficiência do catalisador abaixo do limite",
        "severity": "critical",
        "system": "Emissões",
        "causes": ["Catalisador danificado"],
        "estimatedCost": [800, 2500]
      }
    ],
    "liveData": [
      { "param": "RPM", "value": 850, "unit": "rpm", "status": "normal" },
      { "param": "Temp. Motor", "value": 92, "unit": "°C", "status": "normal" },
      { "param": "Carga Motor", "value": 25, "unit": "%", "status": "normal" },
      { "param": "Acelerador", "value": 15, "unit": "%", "status": "normal" },
      { "param": "Combustível", "value": 65, "unit": "%", "status": "normal" }
    ]
  }
}
```

## 🚗 Comandos OBD-II Implementados

### Scan Rápido
| PID | Descrição | Fórmula |
|-----|-----------|---------|
| 0101 | Status MIL | Bit 7 = MIL, Bits 0-6 = DTC count |
| 010C | RPM | ((A*256)+B)/4 |
| 010D | Velocidade | A |
| 0105 | Temp. Motor | A - 40 |
| 0104 | Carga Motor | (A*100)/255 |
| 0142 | Tensão ECU | ((A*256)+B)/1000 |

### Scan Completo (adicional)
| PID | Descrição | Fórmula |
|-----|-----------|---------|
| 03 | DTCs Ativos | Decodificação especial |
| 07 | DTCs Pendentes | Decodificação especial |
| 0902 | VIN | ASCII |
| 0111 | Acelerador | (A*100)/255 |
| 010F | Temp. Admissão | A - 40 |
| 010B | Pressão MAP | A |
| 0110 | Fluxo MAF | ((A*256)+B)/100 |
| 012F | Combustível | (A*100)/255 |
| 0146 | Temp. Ambiente | A - 40 |
| 015C | Temp. Óleo | A - 40 |
| 0106 | Trim Curto B1 | ((A-128)*100)/128 |
| 0107 | Trim Longo B1 | ((A-128)*100)/128 |
| 010E | Avanço Ignição | (A/2) - 64 |
| 011F | Tempo Ligado | (A*256)+B |

## 🛠️ Instalação

### Backend

```bash
cd backend
npm install
```

**Nota sobre serialport:**
- Windows: Pode precisar de build tools (`npm install --global windows-build-tools`)
- Linux: `sudo apt-get install build-essential libudev-dev`
- macOS: Xcode Command Line Tools

### Frontend
Nenhuma instalação adicional necessária.

## 🚀 Uso

### 1. Iniciar Backend
```bash
cd backend
npm run dev
```

### 2. Conectar Scanner
1. Conecte o ELM327 ao veículo (porta OBD-II)
2. Conecte ao computador (USB/Bluetooth/Wi-Fi)
3. Ligue a ignição do veículo

### 3. Usar no Frontend
1. Abra a página /checkin
2. Clique em "Scanner" no dock
3. Selecione tipo de conexão
4. Clique em "Conectar"
5. Escolha tipo de scan (Rápido/Completo)
6. Clique em "Iniciar Scan"

## 🔄 Modo Simulação

Se o backend não estiver disponível ou não houver scanner conectado, o sistema automaticamente entra em modo simulação, gerando dados realistas para demonstração.

## 📊 Banco de Dados de DTCs

O sistema inclui um banco de dados com mais de 50 códigos DTC comuns, incluindo:
- Descrição em português
- Severidade (info/warning/critical)
- Sistema afetado
- Possíveis causas
- Custo estimado de reparo

## 🔒 Segurança

- Frontend não tem acesso direto ao hardware
- Todas as operações passam pelo backend
- Validação de requisições
- Timeout em operações longas
- Tratamento de erros robusto

## 📁 Estrutura de Arquivos

```
backend/
├── routes/
│   └── obd.js              # Endpoints da API OBD
├── services/
│   └── obdService.js       # Serviço de comunicação OBD
└── server.js               # Servidor Express

src/
├── components/
│   └── modals/
│       └── OBDScannerModal.jsx  # Modal do scanner
└── services/
    └── obdApiService.js    # Cliente da API OBD
```

## ✅ Funcionalidades

- [x] Conexão USB/Serial
- [x] Conexão Wi-Fi
- [x] Scan rápido (dados básicos)
- [x] Scan completo (DTCs + sensores)
- [x] Leitura de VIN
- [x] Status MIL (luz da injeção)
- [x] Banco de dados de DTCs
- [x] Cálculo de saúde do veículo
- [x] Custo estimado de reparo
- [x] Modo simulação (fallback)
- [x] Progresso em tempo real
- [x] Limpar códigos de falha

## 🐛 Troubleshooting

### Scanner não detectado
1. Verifique se o driver USB está instalado
2. Verifique se a porta COM está correta
3. Tente reiniciar o scanner

### Timeout na conexão
1. Verifique se a ignição está ligada
2. Verifique se o scanner está bem conectado
3. Tente outra porta/baudrate

### NO DATA em PIDs
1. Nem todos os veículos suportam todos os PIDs
2. O sistema ignora PIDs não suportados automaticamente

## 📝 Notas

- Testado com veículos a partir de 1996 (OBD-II obrigatório)
- Alguns veículos mais antigos podem não suportar todos os PIDs
- A precisão dos dados depende da qualidade do scanner
