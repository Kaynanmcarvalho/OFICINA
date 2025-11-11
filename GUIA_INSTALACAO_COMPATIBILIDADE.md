# 🚀 Guia de Instalação - Sistema de Compatibilidade de Veículos

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Firebase CLI configurado
- Projeto Firebase ativo
- Dependências do projeto instaladas

## 🔧 Instalação

### 1. Instalar Dependências Adicionais

```bash
npm install node-fetch
```

### 2. Configurar Firestore Indexes

O arquivo `firestore.indexes.json` já deve conter os índices necessários. Execute:

```bash
firebase deploy --only firestore:indexes
```

### 3. Configurar Firestore Rules

Adicione as seguintes regras ao `firestore.rules`:

```javascript
// Coleção vehicles - leitura pública, escrita autenticada
match /vehicles/{vehicleId} {
  allow read: if true;
  allow write: if request.auth != null;
}

// Coleção parts - leitura pública, escrita autenticada
match /parts/{partId} {
  allow read: if true;
  allow write: if request.auth != null;
}

// Coleção compatibility - leitura pública, escrita autenticada
match /compatibility/{compatId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

Deploy das regras:

```bash
firebase deploy --only firestore:rules
```

## 📊 Popular Base de Dados

### Opção 1: Dados de Exemplo (Recomendado para Teste)

```bash
node scripts/addSampleCompatibility.js
```

Este script adiciona:
- 3 peças de exemplo
- 6 veículos populares
- 9 compatibilidades com evidências

### Opção 2: Dados Completos da FIPE

⚠️ **Atenção**: Este processo pode levar várias horas e fazer milhares de requisições.

```bash
node scripts/populateVehiclesFromFIPE.js
```

Para produção, recomendamos:
1. Executar em ambiente de desenvolvimento primeiro
2. Limitar marcas/modelos inicialmente
3. Executar em horários de baixo tráfego
4. Monitorar quotas da API FIPE

## 🎨 Componentes Criados

### 1. VehicleSelector
**Localização**: `src/components/inventory/VehicleSelector.jsx`

Seletor cascata com integração FIPE:
- Tipo → Marca → Modelo → Ano
- Autocomplete com busca
- Animações suaves
- Loading states

### 2. CompatiblePartsList
**Localização**: `src/components/inventory/CompatiblePartsList.jsx`

Lista premium de peças:
- Cards com imagens
- Badges de confiança (Alta/Média/Baixa)
- Ordenação por score
- Filtro "Apenas OEM"

### 3. EvidenceModal
**Localização**: `src/components/inventory/EvidenceModal.jsx`

Modal de evidências:
- Glass effect background
- Timeline de fontes
- Links externos
- Última atualização

### 4. VehicleCompatibilitySearch
**Localização**: `src/components/inventory/VehicleCompatibilitySearch.jsx`

Componente integrado completo:
- Combina todos os componentes
- Gerencia estado global
- Integração com Firestore
- Tratamento de erros

## 🔌 Integração na Página de Inventário

O botão "Buscar por Veículo" foi substituído automaticamente.

Para usar em outras páginas:

```jsx
import VehicleCompatibilitySearch from '../components/inventory/VehicleCompatibilitySearch';

function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Buscar por Veículo
      </button>

      <VehicleCompatibilitySearch
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPartSelect={(part) => {
          console.log('Peça selecionada:', part);
          // Fazer algo com a peça
        }}
      />
    </>
  );
}
```

## 🧪 Testar o Sistema

### 1. Verificar Dados no Firestore

Acesse o Firebase Console e verifique as coleções:
- `/vehicles` - Deve ter veículos cadastrados
- `/parts` - Deve ter peças cadastradas
- `/compatibility` - Deve ter compatibilidades

### 2. Testar na Interface

1. Acesse `/inventory`
2. Clique em "Buscar por Veículo"
3. Selecione:
   - Tipo: Moto
   - Marca: Honda
   - Modelo: CG 160
   - Ano: 2024
4. Verifique se aparecem peças compatíveis
5. Clique em "Ver Evidências" para ver as fontes

### 3. Testar API FIPE

```javascript
// No console do navegador
const response = await fetch('https://parallelum.com.br/fipe/api/v1/motos/marcas');
const marcas = await response.json();
console.log(marcas);
```

## 📈 Próximos Passos

### Curto Prazo
1. ✅ Adicionar mais dados de exemplo
2. ✅ Testar com usuários reais
3. ⏳ Coletar feedback
4. ⏳ Ajustar UX conforme necessário

### Médio Prazo
1. ⏳ Implementar Cloud Functions para ETL
2. ⏳ Scraping de marketplaces
3. ⏳ Extração de PDFs OEM
4. ⏳ Sistema de co-purchase automático

### Longo Prazo
1. ⏳ Machine Learning para sugestões
2. ⏳ API pública para parceiros
3. ⏳ App mobile
4. ⏳ Integração com ERPs

## 🐛 Troubleshooting

### Erro: "Cannot find module 'node-fetch'"
```bash
npm install node-fetch
```

### Erro: "Permission denied" no Firestore
Verifique as regras do Firestore e certifique-se de estar autenticado.

### Erro: "FIPE API not responding"
A API FIPE é gratuita mas pode ter rate limiting. Aguarde alguns minutos e tente novamente.

### Nenhuma peça aparece
1. Verifique se há dados em `/compatibility`
2. Execute `node scripts/addSampleCompatibility.js`
3. Verifique o console do navegador para erros

### Componente não aparece
1. Verifique se o modal está aberto (`isOpen={true}`)
2. Verifique o z-index (deve ser 50)
3. Verifique se há erros no console

## 📚 Recursos

- [API FIPE Documentação](https://deividfortuna.github.io/fipe/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verifique o console do navegador
2. Verifique os logs do Firebase
3. Revise este guia
4. Consulte a documentação dos componentes

---

**Versão**: 1.0.0
**Última Atualização**: 2024
**Status**: Pronto para Produção ✅
