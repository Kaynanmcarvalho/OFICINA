# 🚗 Seleção de Múltiplos Veículos - Resumo Executivo

## 📋 Problema Atual

**Check-in:**
- Ao selecionar cliente, apenas nome e telefone são preenchidos
- Dados do veículo (placa, modelo) não são preenchidos automaticamente
- Se cliente tem múltiplos veículos, não há como escolher qual usar

**Check-out:**
- Se cliente tem múltiplos check-ins ativos, não há como escolher qual veículo está saindo

## ✅ Solução Proposta

### 1. Check-in com Seleção de Veículo

**Fluxo:**
```
1. Atendente busca cliente "Maikon"
2. Sistema verifica veículos cadastrados:
   - Se 1 veículo → Preenche automaticamente
   - Se 2+ veículos → Abre modal de seleção
3. Modal mostra cards visuais:
   ┌─────────────────────┐  ┌─────────────────────┐
   │ 🏍️ MOTO            │  │ 🚗 CARRO           │
   │ RFV-6C13           │  │ ABC-1234           │
   │ Honda CB 600F      │  │ VW Voyage 2021     │
   │ 2020 • Preta       │  │ 2021 • Prata       │
   └─────────────────────┘  └─────────────────────┘
4. Atendente clica no veículo desejado
5. Campos preenchidos automaticamente
6. Confirma check-in
```

### 2. Check-out com Seleção de Veículo

**Fluxo:**
```
1. Atendente clica em check-out do cliente "Maikon"
2. Sistema verifica check-ins ativos:
   - Se 1 check-in → Abre modal de check-out
   - Se 2+ check-ins → Abre modal de seleção
3. Modal mostra veículos com check-in ativo:
   ┌─────────────────────────────┐
   │ 🏍️ Honda CB 600F           │
   │ RFV-6C13                    │
   │ Check-in: 10:30 (2h atrás) │
   └─────────────────────────────┘
   ┌─────────────────────────────┐
   │ 🚗 VW Voyage 2021           │
   │ ABC-1234                    │
   │ Check-in: 14:00 (30m atrás)│
   └─────────────────────────────┘
4. Atendente clica no veículo que está saindo
5. Abre modal de check-out para aquele veículo
```

## 🎨 Componentes a Criar

### 1. `ModalSelecaoVeiculo.jsx`
- Modal com lista de veículos do cliente
- Cards visuais com hover effect
- Botão "Adicionar Novo Veículo"
- Responsivo e bonito

### 2. `VehicleCard.jsx`
- Card individual de veículo
- Ícone do tipo (moto/carro/caminhão)
- Placa em destaque
- Marca, modelo, ano, cor
- Hover effect

### 3. Atualizar `ModalCheckin.jsx`
- Integrar modal de seleção
- Preencher dados automaticamente
- Adicionar novo veículo à lista do cliente

### 4. Atualizar `CheckInPage.jsx`
- Verificar múltiplos check-ins ativos
- Abrir modal de seleção antes do check-out

## 📊 Estrutura de Dados

### Cliente com Veículos:
```javascript
{
  id: "client123",
  name: "Maikon",
  phone: "(62) 99278-2004",
  vehicles: [
    {
      id: "vehicle1",
      plate: "RFV6C13",
      brand: "Honda",
      model: "CB 600F",
      year: "2020",
      color: "Preta",
      type: "moto",
      lastUsed: Timestamp
    },
    {
      id: "vehicle2",
      plate: "ABC1234",
      brand: "Volkswagen",
      model: "Voyage 2021",
      year: "2021",
      color: "Prata",
      type: "carro",
      lastUsed: Timestamp
    }
  ]
}
```

## 🔄 Fluxo de Dados

### Check-in:
1. `CampoBuscaCliente` → Seleciona cliente
2. `ModalCheckin.handleClienteSelect` → Verifica veículos
3. Se múltiplos → Abre `ModalSelecaoVeiculo`
4. Usuário seleciona → Preenche campos
5. Confirma → Salva check-in + atualiza lista de veículos

### Check-out:
1. `CheckInPage` → Clica em check-out
2. Verifica check-ins ativos do cliente
3. Se múltiplos → Abre `ModalSelecaoVeiculo`
4. Usuário seleciona → Abre `ModalCheckout` para aquele veículo
5. Confirma → Finaliza check-out

## 📝 Próximos Passos

Devido ao limite de tokens (45k restantes), recomendo:

1. **Criar spec completa** com design e tasks
2. **Implementar componentes** um por um
3. **Testar fluxos** de check-in e check-out
4. **Ajustar UX** baseado em feedback

## 🎯 Benefícios

- ✅ UX muito melhor
- ✅ Menos erros (veículo errado)
- ✅ Mais rápido (dados preenchidos automaticamente)
- ✅ Profissional e bonito
- ✅ Escalável (suporta N veículos por cliente)

**Status:** Spec criada, pronta para implementação! 🚀
