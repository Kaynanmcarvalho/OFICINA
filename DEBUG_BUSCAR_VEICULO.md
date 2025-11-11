# 🔧 Debug: Botão "Buscar Veículo" Não Funciona

## Problema Identificado

O botão "Buscar Veículo" não estava funcionando por dois motivos:

### 1. **API Endpoint Não Existe**

Ao testar a API:
```bash
curl https://torq.up.railway.app/api/vehicle/ECO4087
```

Resposta:
```json
{"success":false,"error":"Endpoint not found"}
```

**Causa:** O endpoint `/api/vehicle/{placa}` não está configurado no servidor.

### 2. **Possível Problema de Event Handler**

O onClick pode não estar sendo disparado corretamente.

---

## ✅ Soluções Implementadas

### 1. **Modo Mock para Testes**

Adicionei dados de teste (mock) para que você possa testar a interface enquanto configura a API:

```javascript
const MOCK_DATA = {
  'ECO4087': {
    marca: 'Honda',
    modelo: 'CB 600F Hornet',
    ano: '2023',
    cor: 'Vermelha',
    chassi: '9C2JC50001R000001',
    renavam: '12345678901',
    cilindrada: '600',
  },
  'ABC1234': {
    marca: 'Yamaha',
    modelo: 'MT-07',
    ano: '2022',
    cor: 'Azul',
    ...
  }
};
```

**Como funciona:**
1. Sistema verifica se a placa existe nos dados mock
2. Se existir, retorna os dados mock (com delay de 1s para simular API)
3. Se não existir, tenta a API real
4. Se API falhar, retorna erro

### 2. **Logs de Debug Detalhados**

Adicionei logs em cada etapa:

```javascript
console.log('[VehicleForm] Botão clicado!');
console.log('[VehicleForm] handleConsultarPlaca called');
console.log('[VehicleForm] Placa:', formData.plate);
console.log('[VehicleForm] Iniciando consulta...');
console.log('[VehicleAPI] Consultando placa:', cleanPlate);
console.log('[VehicleAPI] 🎭 MODO MOCK - Usando dados de teste');
console.log('[VehicleAPI] Dados mock:', mockData);
```

---

## 🧪 Como Testar Agora

### Teste 1: Com Placa Mock (ECO-4087)

```
1. Digite: ECO-4087
2. Clique em "Buscar Veículo"
3. Aguarde 1 segundo
4. Formulário será preenchido com:
   - Marca: Honda
   - Modelo: CB 600F Hornet
   - Ano: 2023
   - Cor: Vermelha
   - Chassi: 9C2JC50001R000001
   - RENAVAM: 12345678901
   - Cilindrada: 600
```

### Teste 2: Com Placa Mock (ABC-1234)

```
1. Digite: ABC-1234
2. Clique em "Buscar Veículo"
3. Aguarde 1 segundo
4. Formulário será preenchido com:
   - Marca: Yamaha
   - Modelo: MT-07
   - Ano: 2022
   - Cor: Azul
```

### Teste 3: Com Placa Não Cadastrada

```
1. Digite: XYZ-9999
2. Clique em "Buscar Veículo"
3. Sistema tenta API real
4. Retorna erro: "Veículo não encontrado na base de dados"
```

---

## 🔍 Verificar no Console

Abra o console do navegador (F12) e procure por:

### Se o botão não está sendo clicado:
```
❌ Nenhum log aparece
```
**Solução:** Problema no HTML/React. Verificar se o botão está renderizado corretamente.

### Se o botão está sendo clicado mas não consulta:
```
✅ [VehicleForm] Botão clicado!
❌ Nenhum log depois disso
```
**Solução:** Problema na função handleConsultarPlaca. Verificar validações.

### Se está consultando mas não preenche:
```
✅ [VehicleForm] Botão clicado!
✅ [VehicleForm] handleConsultarPlaca called
✅ [VehicleAPI] Consultando placa: ECO4087
✅ [VehicleAPI] 🎭 MODO MOCK - Usando dados de teste
❌ Formulário não preenche
```
**Solução:** Problema no setFormData. Verificar estado do React.

### Se tudo está funcionando:
```
✅ [VehicleForm] Botão clicado!
✅ [VehicleForm] handleConsultarPlaca called
✅ [VehicleForm] Placa: ECO-4087
✅ [VehicleForm] Iniciando consulta...
✅ [VehicleForm] Chamando consultarPlaca...
✅ [VehicleAPI] Consultando placa: ECO4087
✅ [VehicleAPI] 🎭 MODO MOCK - Usando dados de teste
✅ [VehicleAPI] Dados mock: {...}
✅ [VehicleForm] Resultado: {success: true, data: {...}}
✅ Toast: "Dados do veículo carregados com sucesso!"
```

---

## 🚀 Configurar API Real

Quando a API estiver pronta, você precisa:

### 1. **Configurar o Endpoint no Servidor**

O servidor precisa ter uma rota:
```javascript
// Backend (Node.js/Express exemplo)
app.get('/api/vehicle/:plate', async (req, res) => {
  const { plate } = req.params;
  
  try {
    // Consultar banco de dados ou API externa
    const vehicleData = await consultarVeiculo(plate);
    
    res.json({
      marca: vehicleData.brand,
      modelo: vehicleData.model,
      ano: vehicleData.year,
      cor: vehicleData.color,
      chassi: vehicleData.chassis,
      renavam: vehicleData.renavam,
      cilindrada: vehicleData.engineSize,
    });
  } catch (error) {
    res.status(404).json({
      error: 'Veículo não encontrado'
    });
  }
});
```

### 2. **Remover o Modo Mock**

No arquivo `src/services/vehicleApiService.js`, remova ou comente:

```javascript
// REMOVER ESTAS LINHAS:
const MOCK_DATA = { ... };

// E REMOVER ESTE BLOCO:
if (MOCK_DATA[cleanPlate]) {
  // ...
}
```

### 3. **Testar com Placa Real**

```
1. Digite uma placa real
2. Clique em "Buscar Veículo"
3. Sistema consulta API real
4. Formulário é preenchido
```

---

## 📋 Checklist de Debug

Execute este checklist para identificar o problema:

- [ ] **Console aberto?** (F12)
- [ ] **Placa digitada?** (mínimo 7 caracteres)
- [ ] **Placa válida?** (ABC-1234 ou ABC1D23)
- [ ] **Botão habilitado?** (não está cinza)
- [ ] **Clique registrado?** (log "[VehicleForm] Botão clicado!")
- [ ] **Função chamada?** (log "handleConsultarPlaca called")
- [ ] **Validação passou?** (não mostra toast de erro)
- [ ] **Consulta iniciada?** (log "Consultando placa...")
- [ ] **Mock encontrado?** (log "MODO MOCK")
- [ ] **Dados retornados?** (log "Resultado:")
- [ ] **Formulário preenchido?** (campos têm valores)
- [ ] **Toast de sucesso?** (mensagem verde)

---

## 🎯 Placas de Teste Disponíveis

Use estas placas para testar:

| Placa | Marca | Modelo | Ano | Cor |
|-------|-------|--------|-----|-----|
| ECO-4087 | Honda | CB 600F Hornet | 2023 | Vermelha |
| ECO4087 | Honda | CB 600F Hornet | 2023 | Vermelha |
| ABC-1234 | Yamaha | MT-07 | 2022 | Azul |
| ABC1234 | Yamaha | MT-07 | 2022 | Azul |

**Nota:** O sistema aceita com ou sem hífen.

---

## 🔧 Adicionar Mais Placas Mock

Para adicionar mais placas de teste, edite `src/services/vehicleApiService.js`:

```javascript
const MOCK_DATA = {
  'ECO4087': { ... },
  'ABC1234': { ... },
  
  // Adicione aqui:
  'XYZ5678': {
    marca: 'Kawasaki',
    modelo: 'Ninja 400',
    ano: '2024',
    cor: 'Verde',
    chassi: 'JKBZXNC16PA000001',
    renavam: '11122233344',
    cilindrada: '399',
    combustivel: 'Gasolina',
    categoria: 'Motocicleta',
  },
};
```

---

## 📞 Próximos Passos

1. **Teste com ECO-4087** para verificar se o mock funciona
2. **Verifique os logs no console** para identificar onde está travando
3. **Configure a API real** no servidor
4. **Remova o modo mock** quando a API estiver pronta
5. **Teste com placas reais**

---

## 🎨 Exemplo de Uso Completo

```
┌─────────────────────────────────────────────────────────┐
│ Check-in de Veículos                                    │
│ Sistema inteligente de entrada de veículos             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ ECO-4087                                        ✓   ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ 🔍 Buscar Veículo                                   ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ 💡 Consultando placa...                                │
│                                                         │
│ ✅ Dados do veículo carregados com sucesso!            │
│                                                         │
│ Marca: Honda                                            │
│ Modelo: CB 600F Hornet                                  │
│ Ano: 2023                                               │
│ Cor: Vermelha                                           │
│ Chassi: 9C2JC50001R000001                              │
│ RENAVAM: 12345678901                                    │
│ Cilindrada: 600cc                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Resumo

✅ **Modo mock implementado** - Teste com ECO-4087 ou ABC-1234
✅ **Logs detalhados adicionados** - Verifique o console (F12)
✅ **Fallback para API real** - Quando configurada, será usada
✅ **Tratamento de erros** - Mensagens claras para o usuário

**Teste agora com a placa ECO-4087 e verifique os logs no console!**
