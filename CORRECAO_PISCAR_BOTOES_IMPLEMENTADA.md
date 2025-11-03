# Correção do Piscar dos Botões

## Problema Identificado
Dois componentes apresentavam efeito de "piscar" indesejado:
1. **Botões 7D/30D/90D** no card de Receita do dashboard
2. **Botão ON/OFF** (toggle) na tabela de clientes

## Causa Raiz

### 1. GraficoFinanceiro (Botões 7D/30D/90D)
- `setIsLoading(true)` era chamado toda vez que o período mudava
- Isso causava re-render completo do componente com estado de loading
- Resultado: piscar visível durante a troca de dados

### 2. ToggleSwitch (Botão ON/OFF)
- Propriedade `key` forçava re-render completo do ícone
- Animações `initial` muito agressivas
- `stiffness` muito alta na animação do spring

## Soluções Implementadas

### 1. GraficoFinanceiro.jsx
```jsx
// ANTES
const carregarDadosFinanceiros = async () => {
  setIsLoading(true); // Sempre mostrava loading
  try {

// DEPOIS  
const carregarDadosFinanceiros = async () => {
  // Não mostrar loading se já temos dados (evita piscar)
  if (dados.length === 0) {
    setIsLoading(true);
  }
  try {
```

### 2. ToggleSwitch.jsx
```jsx
// ANTES
<motion.div
  key={enabled ? 'check' : 'x'} // Key forçava re-render
  initial={{ scale: 0, rotate: enabled ? -90 : 90 }}
  transition={{ 
    type: "spring",
    stiffness: 700, // Muito agressivo
    damping: 30
  }}

// DEPOIS
<motion.div
  // Removida a key
  animate={{ 
    scale: 1, 
    rotate: 0,
    opacity: 1
  }}
  transition={{ 
    duration: 0.15,
    ease: "easeOut" // Mais suave
  }}
```

## Melhorias Adicionais

### Animação do Thumb
- Reduzida `stiffness` de 700 para 400
- Ajustado `damping` para 25
- Adicionada `duration` de 0.2s para controle preciso

### Remoção de Propriedades Desnecessárias
- Removido `initial={false}` que podia causar conflitos
- Simplificadas as transições para serem mais previsíveis

## Resultado
- ✅ **Botões 7D/30D/90D**: Troca instantânea sem piscar
- ✅ **Toggle ON/OFF**: Animação suave sem re-render
- ✅ **Performance**: Menos re-renders desnecessários
- ✅ **UX**: Transições mais fluidas e profissionais

## Arquivos Modificados
1. `src/pages/dashboard/componentes/GraficoFinanceiro.jsx`
2. `src/components/ui/ToggleSwitch.jsx`

## Teste
Para verificar as correções:
1. **Dashboard**: Clique nos botões 7D/30D/90D - deve trocar sem piscar
2. **Clientes**: Toggle o botão ON/OFF - deve animar suavemente
3. **Performance**: Observe que não há re-renders desnecessários