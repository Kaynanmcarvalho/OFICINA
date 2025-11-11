# 🚗 Integração com API de Consulta de Placas

## Implementação Completa

Integração do botão "Buscar Veículo" com a API `https://torq.up.railway.app` para consulta automática de dados de veículos pela placa.

---

## 🎯 Funcionalidades Implementadas

### 1. **Serviço de API (vehicleApiService.js)**

Criado serviço completo para comunicação com a API:

```javascript
// src/services/vehicleApiService.js

export const consultarPlaca = async (plate) => {
  // Remove caracteres especiais
  const cleanPlate = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // Consulta API
  const response = await fetch(`${API_BASE_URL}/api/vehicle/${cleanPlate}`);
  
  // Retorna dados formatados
  return {
    success: true,
    data: {
      plate, brand, model, year, color,
      chassisNumber, renavam, engineSize, ...
    }
  };
};
```

**Funcionalidades:**
- ✅ Limpeza automática da placa
- ✅ Validação de formato
- ✅ Tratamento de erros
- ✅ Logs detalhados
- ✅ Suporte a placas antigas e Mercosul

---

### 2. **Botão "Buscar Veículo"**

Adicionado botão visual e funcional no formulário:

```jsx
<button
  type="button"
  onClick={handleConsultarPlaca}
  disabled={isConsultingPlate || !formData.plate}
  className="flex items-center gap-2 px-4 py-2 
    bg-gradient-to-r from-orange-500 to-orange-600 
    hover:from-orange-600 hover:to-orange-700 
    text-white rounded-lg font-semibold shadow-lg"
>
  <Car className="w-4 h-4" />
  {isConsultingPlate ? 'Consultando...' : 'Buscar Veículo'}
</button>
```

**Características:**
- 🎨 Gradiente laranja (cor Torq)
- 🚫 Desabilitado quando placa vazia
- ⏳ Loading state durante consulta
- 🔍 Ícone de carro
- 💡 Tooltip explicativo

---

### 3. **Preenchimento Automático**

Ao consultar a placa, o formulário é preenchido automaticamente:

```javascript
const handleConsultarPlaca = async () => {
  const result = await consultarPlaca(formData.plate);
  
  if (result.success) {
    setFormData(prev => ({
      ...prev,
      brand: result.data.brand || prev.brand,
      model: result.data.model || prev.model,
      year: result.data.year || prev.year,
      color: result.data.color || prev.color,
      chassisNumber: result.data.chassisNumber || prev.chassisNumber,
      renavam: result.data.renavam || prev.renavam,
      engineSize: result.data.engineSize || prev.engineSize,
    }));
  }
};
```

**Campos preenchidos:**
- ✅ Marca
- ✅ Modelo
- ✅ Ano
- ✅ Cor
- ✅ Número do Chassi
- ✅ RENAVAM
- ✅ Cilindrada

---

## 🔄 Fluxo de Uso

### Passo a Passo

```
1. Usuário digita a placa
   ↓ "ABC-1234"
   
2. Clica em "Buscar Veículo"
   ↓ Toast: "Consultando placa..."
   
3. Sistema consulta API
   ↓ GET https://torq.up.railway.app/api/vehicle/ABC1234
   
4. API retorna dados
   ↓ { marca: "Honda", modelo: "CB 600F", ... }
   
5. Formulário é preenchido automaticamente
   ↓ Marca: Honda
   ↓ Modelo: CB 600F Hornet
   ↓ Ano: 2023
   ↓ Cor: Vermelha
   
6. Toast de sucesso
   ✅ "Dados do veículo carregados com sucesso!"
```

---

## 📡 Endpoint da API

### Request

```http
GET https://torq.up.railway.app/api/vehicle/{PLACA}
Content-Type: application/json
```

**Exemplo:**
```
GET https://torq.up.railway.app/api/vehicle/ABC1234
```

### Response (Sucesso)

```json
{
  "marca": "Honda",
  "modelo": "CB 600F Hornet",
  "ano": "2023",
  "cor": "Vermelha",
  "chassi": "9C2JC50001R000001",
  "renavam": "12345678901",
  "cilindrada": "600",
  "combustivel": "Gasolina",
  "categoria": "Motocicleta",
  "proprietario": "João Silva",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

### Response (Erro 404)

```json
{
  "error": "Veículo não encontrado"
}
```

---

## 🎨 Interface do Usuário

### Layout do Campo de Placa

```
┌─────────────────────────────────────────────────────────┐
│ Placa *                                                 │
│ ┌──────────────────────┬──────────────────────────────┐│
│ │ ABC-1234             │ 🚗 Buscar Veículo            ││
│ └──────────────────────┴──────────────────────────────┘│
│ 💡 Digite a placa e clique em "Buscar Veículo"         │
│    para preencher automaticamente os dados              │
└─────────────────────────────────────────────────────────┘
```

### Estados do Botão

#### Normal
```
┌──────────────────────────┐
│ 🚗 Buscar Veículo        │
│ (laranja, clicável)      │
└──────────────────────────┘
```

#### Consultando
```
┌──────────────────────────┐
│ 🚗 Consultando...        │
│ (laranja, desabilitado)  │
└──────────────────────────┘
```

#### Desabilitado (sem placa)
```
┌──────────────────────────┐
│ 🚗 Buscar Veículo        │
│ (cinza, desabilitado)    │
└──────────────────────────┘
```

---

## 🔍 Validação de Placas

### Formatos Suportados

#### Placa Antiga (Padrão Brasileiro)
```
Formato: ABC-1234
Regex: /^[A-Z]{3}\d{4}$/
Exemplo: ABC-1234, XYZ-9876
```

#### Placa Mercosul
```
Formato: ABC1D23
Regex: /^[A-Z]{3}\d{1}[A-Z]{1}\d{2}$/
Exemplo: ABC1D23, XYZ9K87
```

### Validação Automática

```javascript
export const isValidPlate = (plate) => {
  const clean = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  const oldFormat = /^[A-Z]{3}\d{4}$/;
  const mercosulFormat = /^[A-Z]{3}\d{1}[A-Z]{1}\d{2}$/;
  
  return oldFormat.test(clean) || mercosulFormat.test(clean);
};
```

---

## 🎯 Mensagens de Feedback

### Toast de Loading
```javascript
toast.loading('Consultando placa...');
```

### Toast de Sucesso
```javascript
toast.success('Dados do veículo carregados com sucesso!');

// Se houver proprietário
toast.success('Proprietário: João Silva', { duration: 5000 });
```

### Toast de Erro
```javascript
// Placa vazia
toast.error('Digite uma placa para consultar');

// Placa inválida
toast.error('Placa inválida. Use o formato ABC-1234 ou ABC1D23');

// Veículo não encontrado
toast.error('Veículo não encontrado');

// Erro na API
toast.error('Erro ao consultar placa. Tente novamente.');
```

---

## 🔧 Tratamento de Erros

### Cenários Tratados

#### 1. Placa Vazia
```javascript
if (!formData.plate) {
  toast.error('Digite uma placa para consultar');
  return;
}
```

#### 2. Placa Inválida
```javascript
if (!isValidPlate(formData.plate)) {
  toast.error('Placa inválida. Use o formato ABC-1234 ou ABC1D23');
  return;
}
```

#### 3. Veículo Não Encontrado (404)
```javascript
if (response.status === 404) {
  throw new Error('Veículo não encontrado');
}
```

#### 4. Erro na API
```javascript
if (!response.ok) {
  throw new Error(`Erro na consulta: ${response.status}`);
}
```

#### 5. Erro de Rede
```javascript
catch (error) {
  console.error('[VehicleAPI] Erro na consulta:', error);
  toast.error('Erro ao consultar placa. Tente novamente.');
}
```

---

## 📊 Logs de Debug

### Console Logs

```javascript
// Início da consulta
console.log('[VehicleAPI] Consultando placa:', cleanPlate);

// Dados recebidos
console.log('[VehicleAPI] Dados recebidos:', data);

// Erro na consulta
console.error('[VehicleAPI] Erro na consulta:', error);
```

### Exemplo de Log Completo

```
[VehicleAPI] Consultando placa: ABC1234
[VehicleAPI] Dados recebidos: {
  marca: "Honda",
  modelo: "CB 600F Hornet",
  ano: "2023",
  cor: "Vermelha",
  ...
}
```

---

## 🚀 Como Usar

### 1. No Formulário de Veículo

```
1. Abra o formulário de cadastro de veículo
2. Digite a placa no campo "Placa"
3. Clique no botão "Buscar Veículo"
4. Aguarde a consulta (1-3 segundos)
5. Dados são preenchidos automaticamente
6. Revise e ajuste se necessário
7. Salve o veículo
```

### 2. Atalhos de Teclado

```
- Digite a placa
- Pressione Tab para ir ao botão
- Pressione Enter para consultar
```

---

## 🔐 Segurança

### Validações Implementadas

1. **Sanitização de Entrada**
   - Remove caracteres especiais
   - Converte para maiúsculas
   - Valida formato

2. **Validação de Resposta**
   - Verifica status HTTP
   - Valida estrutura de dados
   - Trata erros graciosamente

3. **Proteção contra Injeção**
   - Regex para validação
   - Limpeza de caracteres especiais
   - Encoding de URL

---

## 📝 Mapeamento de Campos

### API → Formulário

| Campo API | Campo Formulário | Tipo |
|-----------|------------------|------|
| marca / brand | brand | string |
| modelo / model | model | string |
| ano / year | year | string |
| cor / color | color | string |
| chassi / chassis | chassisNumber | string |
| renavam | renavam | string |
| cilindrada / engineSize | engineSize | string |
| combustivel / fuel | - | info |
| categoria / category | - | info |
| proprietario / owner | - | toast |
| cidade / city | - | info |
| estado / state | - | info |

---

## 🎨 Customização

### Cores do Botão

```css
/* Gradiente Laranja Torq */
from-orange-500 to-orange-600

/* Hover */
hover:from-orange-600 hover:to-orange-700

/* Desabilitado */
disabled:from-gray-400 disabled:to-gray-500
```

### Ícone

```jsx
import { Car } from 'lucide-react';

<Car className="w-4 h-4" />
```

---

## 🧪 Testes

### Casos de Teste

#### 1. Placa Válida (Sucesso)
```
Input: ABC-1234
Expected: Dados preenchidos + Toast de sucesso
```

#### 2. Placa Inválida
```
Input: 123-ABCD
Expected: Toast de erro "Placa inválida"
```

#### 3. Placa Não Encontrada
```
Input: ZZZ-9999
Expected: Toast de erro "Veículo não encontrado"
```

#### 4. Campo Vazio
```
Input: (vazio)
Expected: Botão desabilitado
```

#### 5. Erro de Rede
```
Input: ABC-1234 (API offline)
Expected: Toast de erro "Erro ao consultar placa"
```

---

## 📈 Melhorias Futuras

### Sugestões

1. **Cache de Consultas**
   - Armazenar consultas recentes
   - Evitar consultas duplicadas
   - Reduzir chamadas à API

2. **Histórico de Consultas**
   - Salvar placas consultadas
   - Sugerir placas recentes
   - Estatísticas de uso

3. **Consulta em Lote**
   - Importar CSV com placas
   - Consultar múltiplas placas
   - Exportar resultados

4. **Validação Avançada**
   - Verificar dígito verificador
   - Validar estado de origem
   - Alertar sobre placas clonadas

5. **Integração com Outros Sistemas**
   - DETRAN
   - RENAVAM
   - Multas e débitos

---

## 🎯 Resumo

✅ **Serviço de API criado** - `vehicleApiService.js`
✅ **Botão implementado** - Design Torq com gradiente laranja
✅ **Preenchimento automático** - 7 campos preenchidos
✅ **Validação completa** - Placas antigas e Mercosul
✅ **Tratamento de erros** - 5 cenários cobertos
✅ **Feedback visual** - Toasts e loading states
✅ **Logs de debug** - Console logs detalhados

O sistema está pronto para uso e totalmente integrado com a API `https://torq.up.railway.app`.
