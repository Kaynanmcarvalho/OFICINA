# 🚗 Como Implementar Consulta de Placas Corretamente

## ⚠️ Problema: CORS e Privacidade

As APIs de consulta de placas **NÃO funcionam diretamente do frontend** por 3 motivos:

1. **CORS**: APIs bloqueiam requisições de browsers por segurança
2. **LGPD**: Dados de veículos são sensíveis e protegidos
3. **Segurança**: API Keys não devem estar expostas no frontend

## ✅ Solução: Backend Proxy

Você precisa criar um endpoint no seu backend que faz a consulta.

### Arquitetura Correta

```
Frontend (React) → Backend (Node.js/Express) → API de Placas → Retorna dados
```

## 🔧 Implementação Passo a Passo

### 1. Criar Endpoint no Backend

Crie um arquivo `backend/routes/vehicleRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Endpoint para consultar placa
router.post('/consulta-placa', async (req, res) => {
    try {
        const { placa } = req.body;
        
        // Valida placa
        if (!placa || placa.length !== 7) {
            return res.status(400).json({ 
                success: false, 
                error: 'Placa inválida' 
            });
        }

        // Consulta API (exemplo com Placa Fipe)
        const response = await axios.get(
            `https://wdapi2.com.br/consulta/${placa}/${process.env.PLACA_FIPE_TOKEN}`
        );

        // Retorna dados
        res.json({
            success: true,
            data: {
                placa: response.data.PLACA,
                marca: response.data.MARCA,
                modelo: response.data.MODELO,
                ano: response.data.ANO,
                cor: response.data.COR,
                tipo: response.data.TIPO
            }
        });

    } catch (error) {
        console.error('Erro ao consultar placa:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao consultar placa' 
        });
    }
});

module.exports = router;
```

### 2. Configurar Variáveis de Ambiente

Crie `backend/.env`:

```env
# API de Consulta de Placas
PLACA_FIPE_TOKEN=seu_token_aqui

# Ou use outra API
CONSULTA_PLACA_KEY=sua_chave_aqui
```

### 3. Registrar Rota no Backend

Em `backend/server.js`:

```javascript
const vehicleRoutes = require('./routes/vehicleRoutes');

app.use('/api/vehicles', vehicleRoutes);
```

### 4. Atualizar Frontend

Em `src/services/vehicleApiService.js`:

```javascript
export const searchVehicleByPlate = async (plate) => {
    try {
        const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
        
        // Chama seu backend
        const response = await fetch('http://localhost:3000/api/vehicles/consulta-placa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ placa: cleanPlate })
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Erro ao buscar veículo:', error);
        return {
            success: false,
            error: 'Erro ao consultar placa'
        };
    }
};
```

## 💰 APIs Recomendadas (Pagas)

### 1. Placa Fipe (Mais Popular)
- **Site**: https://wdapi2.com.br
- **Custo**: R$ 0,10 por consulta
- **Dados**: Completos (marca, modelo, ano, cor)
- **Suporte**: Excelente
- **CORS**: Funciona via backend

**Como contratar:**
1. Acesse wdapi2.com.br
2. Crie uma conta
3. Compre créditos (mínimo R$ 50)
4. Obtenha seu token
5. Configure no backend

### 2. Consulta Placa Premium
- **Site**: https://consultaplaca.com.br
- **Custo**: R$ 0,15 por consulta
- **Dados**: Muito completos
- **Suporte**: Bom

### 3. API Brasil
- **Site**: https://apibrasil.com.br
- **Custo**: R$ 0,08 por consulta
- **Dados**: Básicos
- **Suporte**: Regular

## 🆓 Alternativa Gratuita (Limitada)

### Brasil API (Apenas FIPE, sem placa)
A Brasil API é gratuita mas **NÃO consulta por placa**, apenas por código FIPE.

Você pode usar para buscar marcas e modelos:

```javascript
// Buscar marcas
fetch('https://brasilapi.com.br/api/fipe/marcas/v1/carros')

// Buscar modelos
fetch('https://brasilapi.com.br/api/fipe/marcas/v1/carros/59') // 59 = Honda
```

## 🎯 Recomendação Final

### Para Produção Real:
1. ✅ Contrate Placa Fipe API (R$ 0,10/consulta)
2. ✅ Implemente backend proxy
3. ✅ Configure rate limiting
4. ✅ Implemente cache de consultas

### Para Desenvolvimento/Teste:
1. ✅ Use preenchimento manual
2. ✅ Implemente busca por marca/modelo via FIPE (gratuito)
3. ✅ Deixe consulta de placa desabilitada

## 📝 Código Completo do Backend

Criei um exemplo completo em `backend/routes/vehicleRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Consulta placa via Placa Fipe
router.post('/consulta-placa', async (req, res) => {
    try {
        const { placa } = req.body;
        const token = process.env.PLACA_FIPE_TOKEN;

        if (!token) {
            return res.status(500).json({ 
                success: false, 
                error: 'API não configurada' 
            });
        }

        const response = await axios.get(
            `https://wdapi2.com.br/consulta/${placa}/${token}`,
            { timeout: 10000 }
        );

        if (response.data.erro) {
            return res.status(404).json({ 
                success: false, 
                error: 'Placa não encontrada' 
            });
        }

        res.json({
            success: true,
            data: {
                placa: response.data.PLACA,
                marca: response.data.MARCA,
                modelo: response.data.MODELO,
                ano: response.data.ANO,
                cor: response.data.COR,
                tipo: detectVehicleType(response.data.TIPO)
            }
        });

    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao consultar placa' 
        });
    }
});

// Busca marcas FIPE (gratuito)
router.get('/marcas/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params; // carros, motos, caminhoes
        
        const response = await axios.get(
            `https://parallelum.com.br/fipe/api/v1/${tipo}/marcas`
        );

        res.json({
            success: true,
            data: response.data.map(m => ({
                value: m.codigo,
                label: m.nome
            }))
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao buscar marcas' 
        });
    }
});

// Busca modelos FIPE (gratuito)
router.get('/modelos/:tipo/:marca', async (req, res) => {
    try {
        const { tipo, marca } = req.params;
        
        const response = await axios.get(
            `https://parallelum.com.br/fipe/api/v1/${tipo}/marcas/${marca}/modelos`
        );

        res.json({
            success: true,
            data: response.data.modelos.map(m => ({
                value: m.codigo,
                label: m.nome
            }))
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Erro ao buscar modelos' 
        });
    }
});

function detectVehicleType(tipo) {
    if (!tipo) return 'carro';
    const t = tipo.toLowerCase();
    if (t.includes('moto')) return 'moto';
    if (t.includes('caminhao') || t.includes('caminhão')) return 'caminhao';
    return 'carro';
}

module.exports = router;
```

## 🚀 Deploy

### Heroku
```bash
heroku config:set PLACA_FIPE_TOKEN=seu_token
```

### Vercel/Netlify
Configure nas variáveis de ambiente do painel

### Docker
```dockerfile
ENV PLACA_FIPE_TOKEN=seu_token
```

## ✅ Checklist de Implementação

- [ ] Contratar API de consulta de placas
- [ ] Criar endpoint no backend
- [ ] Configurar variáveis de ambiente
- [ ] Testar consulta no Postman
- [ ] Atualizar frontend para usar backend
- [ ] Implementar tratamento de erros
- [ ] Adicionar rate limiting
- [ ] Implementar cache de consultas
- [ ] Testar em produção

---

**Status Atual**: ⚠️ Consulta de placas desabilitada (requer backend)  
**Alternativa**: ✅ Preenchimento manual funcionando  
**Próximo Passo**: Implementar backend proxy
