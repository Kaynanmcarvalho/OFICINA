# 🚗 Vehicle Database Sync

Sistema automatizado de sincronização da base de dados de veículos brasileiros com a API FIPE.

## 🎯 O que faz?

1. **Consulta a API FIPE** - Obtém todos os veículos oficiais (carros, motos, caminhões)
2. **Compara com a base local** - Identifica o que está faltando
3. **Adiciona automaticamente** - Insere os veículos faltantes no arquivo principal

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
cd scripts/vehicle-database-sync
npm install

# 2. Ver estatísticas atuais da base
npm run stats

# 3. Sincronização completa (recomendado)
npm run full-sync

# 4. Ou sincronizar por tipo
npm run sync:cars    # Apenas carros
npm run sync:motos   # Apenas motos
npm run sync:trucks  # Apenas caminhões
```

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run full-sync` | Sincronização completa automatizada |
| `npm run sync` | Sincroniza e gera relatório |
| `npm run sync:cars` | Sincroniza apenas carros |
| `npm run sync:motos` | Sincroniza apenas motos |
| `npm run sync:trucks` | Sincroniza apenas caminhões |
| `npm run add` | Adiciona veículos do relatório ao arquivo principal |
| `npm run add:dry` | Mostra o que seria adicionado (sem alterar) |
| `npm run stats` | Mostra estatísticas da base atual |

## 🔧 Opções Avançadas

### Sincronizar apenas uma marca
```bash
node src/fullSync.js --brand="Honda"
node src/fullSync.js --brand="Yamaha"
node src/fullSync.js --brand="BMW"
```

### Modo Dry Run (sem alterações)
```bash
node src/fullSync.js --dry-run
node src/fullSync.js --type=motos --dry-run
```

### Sincronizar tipo específico + marca
```bash
node src/fullSync.js --type=motos --brand="Honda"
```

## 📊 Estrutura de Arquivos

```
scripts/vehicle-database-sync/
├── src/
│   ├── index.js          # Script principal de sync
│   ├── fullSync.js       # Sincronização completa automatizada
│   ├── addMissing.js     # Adiciona veículos faltantes
│   ├── stats.js          # Estatísticas da base
│   ├── config.js         # Configurações e mapeamentos
│   ├── fipeApi.js        # Cliente da API FIPE
│   ├── vehicleParser.js  # Parser de dados de veículos
│   ├── databaseComparer.js # Comparador de bases
│   └── codeGenerator.js  # Gerador de código TypeScript
├── reports/              # Relatórios gerados
│   ├── sync-report.json
│   └── full-sync-report.json
├── package.json
└── README.md
```

## 🔄 Fluxo de Sincronização

```
┌─────────────────┐
│   API FIPE      │
│  (Oficial BR)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Consulta todas │
│  marcas/modelos │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Compara com   │
│   base local    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Identifica     │
│  faltantes      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gera código    │
│  TypeScript     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Adiciona ao    │
│  arquivo        │
└─────────────────┘
```

## 📝 Marcas Prioritárias

### Carros
- Volkswagen, Chevrolet, Fiat, Ford, Toyota, Honda
- Hyundai, KIA, Renault, Nissan, Jeep, Peugeot
- Citroën, Mitsubishi, Suzuki, BMW, Audi, Mercedes-Benz
- Porsche, Volvo, Land Rover, Chery, JAC, BYD, GWM

### Motos
- Honda, Yamaha, Suzuki, Kawasaki, BMW, Ducati
- Harley-Davidson, Triumph, KTM, Royal Enfield
- Dafra, Shineray, Haojue

### Caminhões
- Mercedes-Benz, Volkswagen, Scania, Volvo
- Iveco, Ford, DAF, MAN, Agrale

## ⚠️ Notas Importantes

1. **Rate Limiting**: O sistema respeita limites da API FIPE (3 requisições simultâneas, 200ms entre cada)

2. **Retry Automático**: Em caso de falha, tenta novamente até 3 vezes

3. **Backup**: Sempre faça backup do arquivo `brazilianVehicles.ts` antes de sincronizar

4. **Validação**: Após sincronizar, verifique se o arquivo TypeScript compila corretamente

## 🐛 Troubleshooting

### Erro de conexão
```bash
# Verifique sua conexão com a internet
# A API FIPE pode estar temporariamente indisponível
```

### Arquivo muito grande
```bash
# Sincronize por tipo para evitar timeout
npm run sync:cars
npm run sync:motos
npm run sync:trucks
```

### Marca não encontrada
```bash
# Verifique o nome exato da marca na FIPE
node src/index.js --type=cars | grep -i "honda"
```

## 📈 Exemplo de Saída

```
🚀 FULL SYNC - Sincronização Completa Automatizada

📂 Carregando base de dados local...
   ✓ 35 marcas, 450 modelos

🔍 Consultando FIPE: CARS...
   Encontradas 87 marcas na FIPE
   Processando 35 marcas

📦 Volkswagen
   ✓ 245 veículos encontrados

📦 Honda
   ✓ 89 veículos encontrados

📊 Comparando com base local...
   - FIPE: 2500 veículos
   - Local: 35 marcas, 450 modelos
   - Faltantes: 150 veículos

📝 Adicionando veículos faltantes...
   Honda:
      ✓ 12 variantes
   Yamaha:
      ✓ 8 variantes

✅ 20 variantes adicionadas com sucesso!
⏱️  Tempo total: 45.2s
```

## 📄 Licença

Uso interno - TORQ AI
