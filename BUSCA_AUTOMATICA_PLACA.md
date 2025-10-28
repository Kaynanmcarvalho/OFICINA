# ✅ Busca Automática de Placa na Busca Manual

## 🎯 Funcionalidade Implementada

Quando o usuário está na aba "Busca Manual" e digita uma placa completa (7 caracteres), o sistema automaticamente busca os dados do veículo e preenche todos os campos.

## 🚀 Como Funciona

### Fluxo Automático:

1. **Usuário seleciona "Busca Manual"**
2. **Usuário digita placa no campo "Placa"** (ex: RFV6C13)
3. **Ao completar 7 caracteres:**
   - Sistema detecta automaticamente
   - Busca dados no cache/scraping
   - Preenche automaticamente:
     - ✅ Tipo (Moto/Carro/Caminhão)
     - ✅ Marca (ex: VOLKSWAGEN)
     - ✅ Modelo (ex: VOYAGE 1.6L MB5)
     - ✅ Ano (ex: 2021)
     - ✅ Cor (ex: Prata)

### Exemplo Prático:

**Antes (Manual Puro):**
```
1. Seleciona "Busca Manual"
2. Seleciona Tipo: Moto
3. Seleciona Marca: Honda
4. Seleciona Modelo: CB 600F
5. Digite Placa: RFV6C13
6. Digite Ano: 2021
7. Digite Cor: Prata
```

**Depois (Busca Automática):**
```
1. Seleciona "Busca Manual"
2. Digite Placa: RFV6C13
3. ✨ TODOS OS CAMPOS PREENCHIDOS AUTOMATICAMENTE!
   - Tipo: Moto
   - Marca: VOLKSWAGEN
   - Modelo: VOYAGE 1.6L MB5 2021
   - Ano: 2021
   - Cor: Prata
```

## 💻 Implementação Técnica

### Modificação no `handlePlateSearch`:

Quando a busca é feita na "Busca Manual", o sistema:

1. **Busca dados da placa** (cache ou scraping)
2. **Carrega marcas** do tipo de veículo encontrado
3. **Encontra e seleciona a marca** no dropdown
4. **Carrega modelos** da marca selecionada
5. **Encontra e seleciona o modelo** no dropdown
6. **Preenche ano e cor** automaticamente

```javascript
const handlePlateSearch = async (vehicleId, plate) => {
    const result = await searchVehicleByPlate(plate);
    
    if (result.success) {
        // 1. Atualiza dados básicos
        updateVehicle(vehicleId, 'type', vehicleData.tipo);
        updateVehicle(vehicleId, 'brand', vehicleData.marca);
        updateVehicle(vehicleId, 'model', vehicleData.modelo);
        updateVehicle(vehicleId, 'year', vehicleData.ano);
        updateVehicle(vehicleId, 'color', vehicleData.cor);
        
        // 2. Se busca manual, preencher dropdowns
        if (searchMode === 'manual') {
            // Carregar marcas
            const brandsResult = await fetchBrands(vehicleType);
            setAvailableBrands(brandsResult.data);
            
            // Encontrar e selecionar marca
            const brandMatch = brandsResult.data.find(b => 
                b.label.includes(vehicleData.marca)
            );
            updateVehicle(vehicleId, 'brandCode', brandMatch.value);
            
            // Carregar modelos
            const modelsResult = await fetchModels(vehicleType, brandMatch.value);
            setAvailableModels(modelsResult.data);
            
            // Encontrar e selecionar modelo
            const modelMatch = modelsResult.data.find(m => 
                m.label.includes(vehicleData.modelo)
            );
            updateVehicle(vehicleId, 'modelCode', modelMatch.value);
        }
    }
};
```

### Lógica:

1. **Detecta quando campo é 'plate'**
2. **Verifica se tem 7 caracteres**
3. **Confirma que está na busca manual**
4. **Busca dados da placa**
5. **Carrega e seleciona nos dropdowns automaticamente**

## 🎨 Experiência do Usuário

### Busca Manual COM Placa:

**Usuário digita:** R-F-V-6-C-1-3

**Ao digitar o último caractere:**
- Sistema busca automaticamente
- Toast: "Consultando placa..."
- Aguarda ~1 segundo (cache) ou ~10 segundos (scraping)
- Toast: "Veículo encontrado!"
- Todos os campos preenchidos! ✨

### Busca Manual SEM Placa:

**Usuário não sabe a placa:**
- Seleciona Tipo manualmente
- Seleciona Marca manualmente
- Seleciona Modelo manualmente
- Digite Placa (se souber)
- Digite Ano
- Digite Cor

## 📊 Benefícios

1. ✅ **Velocidade:** Usuário não precisa preencher campo por campo
2. ✅ **Precisão:** Dados vêm do cache/scraping (mais confiáveis)
3. ✅ **UX Melhorada:** Menos cliques, menos tempo
4. ✅ **Flexibilidade:** Ainda pode editar campos se necessário
5. ✅ **Inteligente:** Só busca na busca manual (não interfere na busca por placa)

## 🔍 Logs no Console

**Quando busca automática é acionada:**
```
[AUTO-SEARCH] Placa completa detectada na busca manual: RFV6C13
[VEHICLE API] 🔍 Buscando placa: RFV6C13
[VEHICLE API] 📦 Verificando cache...
[CACHE] ✅ Placa encontrada no cache!
[VEHICLE API] ✅ Cache HIT! Retornando dados instantaneamente
```

## 🎯 Casos de Uso

### Caso 1: Oficina com Placa Conhecida

**Cenário:** Cliente chega e informa a placa

**Fluxo:**
1. Atendente abre "Novo Cliente"
2. Vai para aba "Veículos"
3. Seleciona "Busca Manual"
4. Digite placa: RFV6C13
5. ✨ Todos os campos preenchidos automaticamente!
6. Confirma e salva

**Tempo:** < 30 segundos

### Caso 2: Oficina SEM Placa Conhecida

**Cenário:** Cliente não sabe a placa de cor

**Fluxo:**
1. Atendente abre "Novo Cliente"
2. Vai para aba "Veículos"
3. Seleciona "Busca Manual"
4. Seleciona Tipo: Moto
5. Seleciona Marca: Honda
6. Seleciona Modelo: CB 600F
7. Digite Ano: 2021
8. Digite Cor: Preta
9. Deixa placa em branco (ou preenche depois)

**Tempo:** ~1-2 minutos

### Caso 3: Placa Não Encontrada

**Cenário:** Placa não está no cache nem no keplaca.com

**Fluxo:**
1. Digite placa: XYZ9999
2. Sistema busca automaticamente
3. Toast: "Placa não encontrada. Preencha manualmente."
4. Usuário preenche campos manualmente
5. Salva

**Tempo:** ~30 segundos + tempo de preenchimento manual

## ✨ Diferencial

**Antes:** Busca Manual era 100% manual (usuário preenchia tudo)

**Depois:** Busca Manual é "semi-automática":
- Se tem placa → Busca automática ✨
- Se não tem placa → Preenche manualmente

**Melhor dos dois mundos!**

## 🎉 Status

**IMPLEMENTADO E PRONTO PARA USO!**

- ✅ Busca automática ao digitar 7 caracteres
- ✅ Funciona apenas na busca manual
- ✅ Não interfere na busca por placa
- ✅ Preenche todos os campos automaticamente
- ✅ Usa cache para velocidade
- ✅ Fallback para scraping se necessário

**Teste agora:**
1. Abra "Novo Cliente"
2. Vá para "Veículos"
3. Clique em "Busca Manual"
4. Digite uma placa: RFV6C13
5. Veja a mágica acontecer! ✨
