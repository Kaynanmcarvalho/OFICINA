# 🚗 Vehicle Database Sync

Sistema de sincronização da base de dados de veículos brasileiros com a API FIPE.

## 📋 Visão Geral

Este sistema permite:
- Baixar dados de marcas da FIPE
- Sincronizar modelos e anos de cada marca
- Comparar com a base local
- Adicionar veículos faltantes automaticamente

## 🚀 Quick Start

```bash
# 1. Instalar dependências
cd scripts/vehicle-database-sync
npm install

# 2. Baixar dados de marcas (rápido)
npm run download

# 3. Sincronizar carros (demora ~30min por marca)
npm run sync:cars

# 4. Aplicar resultados ao arquivo principal
npm run apply
```

## 📦 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run download` | Baixa lista de marcas da FIPE |
| `npm run sync` | Sincroniza todas as marcas prioritárias |
| `npm run sync:cars` | Sincroniza apenas carros |
| `npm run sync:motos` | Sincroniza apenas motos |
| `npm run sync:brand Honda` | Sincroniza marca específica |
| `npm run apply` | Aplica resultados ao arquivo principal |
| `npm run apply:dry` | Mostra o que seria aplicado (sem alterar) |
| `npm run stats` | Mostra estatísticas da base atual |

## 📁 Estrutura

```
vehicle-database-sync/
├── src/
│   ├── syncFromLocal.js    # Script principal de sync
│   ├── applySync.js        # Aplica resultados
│   ├── downloadFipeData.js # Baixa dados de marcas
│   ├── stats.js            # Estatísticas
│   ├── config.js           # Configurações
│   └── ...
├── data/                   # Dados baixados da FIPE
├── cache/                  # Cache de requisições
├── reports/                # Relatórios de sync
└── package.json
```

## ⚙️ Como Funciona

1. **Download**: Baixa lista de marcas da API FIPE oficial
2. **Sync**: Para cada marca, busca modelos e anos com cache
3. **Compare**: Compara com `brazilianVehicles.ts`
4. **Apply**: Gera código TypeScript e adiciona ao arquivo

## 🔧 Configuração

Edite `src/config.js` para ajustar:
- Marcas prioritárias
- Rate limiting
- Anos a considerar

## 📊 Base de Dados Atual

A base atual (`brazilianVehicles.ts`) contém:
- ~28 marcas
- ~523 modelos
- ~7.948 variantes (modelo + ano)

## ⚠️ Rate Limiting

A API FIPE tem rate limiting agressivo. O sistema usa:
- Cache em disco (válido por 7 dias)
- Delays de 2-3 segundos entre requests
- Pausas de 30 segundos entre marcas
- Retry automático com backoff exponencial

## 🐛 Troubleshooting

**Erro 429 (Too Many Requests)**
- Aguarde alguns minutos e tente novamente
- O cache evita requisições repetidas

**Arquivo não encontrado**
- Execute `npm run download` primeiro
- Verifique se está no diretório correto

## 📝 Licença

Parte do projeto TORQ AI - Sistema de Gestão Automotiva
