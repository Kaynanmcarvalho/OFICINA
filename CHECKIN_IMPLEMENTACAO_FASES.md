# 🚀 Check-in Premium - Guia de Implementação por Fases

## 📋 Visão Geral

Este documento guia a implementação completa do sistema de check-in premium em fases gerenciáveis.

---

## 🎯 Fase 1: Services e Dados (PRIORIDADE MÁXIMA)

### Arquivos a Criar:

#### 1. `src/services/vehicleDataService.js`
```javascript
/**
 * Service para buscar dados do veículo no backend
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getVehicleByPlate = async (placa) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/vehicle/${placa}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar veículo:', error);
    throw error;
  }
};

export const formatPlate = (placa) => {
  return placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

export const validatePlate = (placa) => {
  const formatted = formatPlate(placa);
  // Formato antigo: ABC1234 ou novo: ABC1D23
  return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(formatted);
};
```

#### 2. `src/services/checkinService.js`
```javascript
/**
 * Service para gerenciar check-ins no Firestore
 */
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getEmpresaId } from '../contexts/EmpresaContext';

export const createCheckin = async (checkinData) => {
  const empresaId = getEmpresaId();
  
  const docData = {
    ...checkinData,
    empresaId,
    status: 'em_atendimento',
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, 'checkins'), docData);
  return docRef.id;
};

export const getCheckinHistory = async (placa) => {
  const empresaId = getEmpresaId();
  
  const q = query(
    collection(db, 'checkins'),
    where('empresaId', '==', empresaId),
    where('placa', '==', placa),
    orderBy('criadoEm', 'desc'),
    limit(5)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const generatePIN = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
```

#### 3. `src/services/locationService.js`
```javascript
/**
 * Service para geolocalização
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => reject(error),
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
};

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await response.json();
    
    return {
      cidade: data.address.city || data.address.town || data.address.village,
      estado: data.address.state,
      pais: data.address.country
    };
  } catch (error) {
    console.error('Erro no reverse geocoding:', error);
    return { cidade: 'Desconhecida', estado: 'Desconhecido' };
  }
};
```

#### 4. `src/services/storageService.js`
```javascript
/**
 * Service para upload de fotos no Firebase Storage
 */
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { getEmpresaId } from '../contexts/EmpresaContext';

export const uploadCheckinPhoto = async (file, placa, tipo = 'entrada') => {
  const empresaId = getEmpresaId();
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  
  const path = `checkins/${empresaId}/${placa}/${timestamp}/${tipo}/${fileName}`;
  const storageRef = ref(storage, path);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return url;
};

export const applyOverlay = async (file, cor, marca) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        
        // Desenha imagem original
        ctx.drawImage(img, 0, 0);
        
        // Aplica overlay de cor
        ctx.fillStyle = cor + '20'; // 20 = 12% opacity
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Adiciona logo da marca (simplificado)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(marca, 20, canvas.height - 20);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.9);
      };
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  });
};
```

---

## 🎯 Fase 2: Arquivos de Dados JSON

### Criar em `src/pages/checkin/data/`:

#### 1. `maintenance_data.json`
```json
{
  "Honda": {
    "Civic": {
      "recomendacoes": [
        "Troca de óleo a cada 10.000 km",
        "Revisão de freios a cada 20.000 km",
        "Alinhamento e balanceamento a cada 15.000 km"
      ]
    },
    "City": {
      "recomendacoes": [
        "Troca de óleo a cada 10.000 km",
        "Verificação de correia dentada aos 60.000 km"
      ]
    }
  },
  "Toyota": {
    "Corolla": {
      "recomendacoes": [
        "Troca de óleo a cada 10.000 km",
        "Revisão completa a cada 20.000 km"
      ]
    }
  },
  "default": {
    "recomendacoes": [
      "Troca de óleo regular",
      "Verificação de freios",
      "Manutenção preventiva"
    ]
  }
}
```

#### 2. `car_specs.json`
```json
{
  "Honda": {
    "Civic": {
      "combustivel": "Flex",
      "consumo": "12 km/l (cidade) / 15 km/l (estrada)",
      "motor": "2.0 16V i-VTEC",
      "alertas": [
        "Correia dentada aos 60.000 km",
        "Velas aos 40.000 km"
      ]
    }
  },
  "default": {
    "combustivel": "Flex",
    "consumo": "10-12 km/l",
    "motor": "Informação não disponível",
    "alertas": ["Manutenção preventiva regular"]
  }
}
```

#### 3. `service_suggestions.json`
```json
{
  "quilometragem": {
    "10000": [
      { "id": "oleo", "nome": "Troca de óleo", "prioridade": "alta" },
      { "id": "filtros", "nome": "Troca de filtros", "prioridade": "alta" }
    ],
    "20000": [
      { "id": "oleo", "nome": "Troca de óleo", "prioridade": "alta" },
      { "id": "freios", "nome": "Revisão de freios", "prioridade": "media" },
      { "id": "alinhamento", "nome": "Alinhamento e balanceamento", "prioridade": "media" }
    ],
    "40000": [
      { "id": "oleo", "nome": "Troca de óleo", "prioridade": "alta" },
      { "id": "velas", "nome": "Troca de velas", "prioridade": "alta" },
      { "id": "revisao", "nome": "Revisão completa", "prioridade": "alta" }
    ]
  },
  "ano": {
    "2020-2024": [
      { "id": "preventiva", "nome": "Manutenção preventiva", "prioridade": "media" }
    ],
    "2015-2019": [
      { "id": "preventiva", "nome": "Manutenção preventiva", "prioridade": "alta" },
      { "id": "correia", "nome": "Verificação de correias", "prioridade": "media" }
    ],
    "2010-2014": [
      { "id": "revisao", "nome": "Revisão completa", "prioridade": "alta" },
      { "id": "correia", "nome": "Troca de correia dentada", "prioridade": "alta" }
    ]
  }
}
```

#### 4. `checklist_data.json`
```json
{
  "carro": [
    { "id": "oleo", "label": "Nível de óleo", "icon": "droplet", "categoria": "motor" },
    { "id": "agua", "label": "Nível de água", "icon": "droplet", "categoria": "motor" },
    { "id": "freio", "label": "Fluido de freio", "icon": "disc", "categoria": "freios" },
    { "id": "pneus", "label": "Estado dos pneus", "icon": "circle", "categoria": "rodas" },
    { "id": "pressao", "label": "Pressão dos pneus", "icon": "gauge", "categoria": "rodas" },
    { "id": "farol", "label": "Faróis", "icon": "lightbulb", "categoria": "eletrica" },
    { "id": "setas", "label": "Setas", "icon": "arrow-right", "categoria": "eletrica" },
    { "id": "freio_mao", "label": "Freio de mão", "icon": "hand", "categoria": "freios" },
    { "id": "limpador", "label": "Limpadores de para-brisa", "icon": "wind", "categoria": "geral" },
    { "id": "bateria", "label": "Bateria", "icon": "battery", "categoria": "eletrica" }
  ],
  "moto": [
    { "id": "oleo", "label": "Nível de óleo", "icon": "droplet", "categoria": "motor" },
    { "id": "corrente", "label": "Tensão da corrente", "icon": "link", "categoria": "transmissao" },
    { "id": "pneus", "label": "Estado dos pneus", "icon": "circle", "categoria": "rodas" },
    { "id": "freios", "label": "Pastilhas de freio", "icon": "disc", "categoria": "freios" },
    { "id": "luzes", "label": "Sistema de iluminação", "icon": "lightbulb", "categoria": "eletrica" }
  ]
}
```

---

## 🎯 Fase 3: Componentes Base

### Ordem de Criação:

1. **PlateSearch.jsx** - Busca de placa (PRIMEIRO)
2. **VehicleInfoPanel.jsx** - Painel de informações
3. **VehicleVisual.jsx** - Renderização visual
4. **TechnicalPanel.jsx** - Especificações técnicas

---

## 🎯 Fase 4: Componentes Avançados

1. **PhotoUploadSection.jsx** - Upload com overlay
2. **Checklist.jsx** - Checklist inteligente
3. **ServiceSuggestions.jsx** - Sugestões preditivas
4. **HistoryTimeline.jsx** - Histórico

---

## 🎯 Fase 5: Finalização

1. **FinalizeModal.jsx** - Modal final com PIN
2. **CheckinPage.jsx** - Página principal
3. **Testes e ajustes**

---

## 📝 Notas Importantes

### Multi-tenancy
Todos os services já incluem `empresaId` automaticamente via `getEmpresaId()`.

### Tema Dinâmico
Use sempre as variáveis CSS globais do sistema para cores.

### Animações
Todas as transições devem usar Framer Motion com variants suaves.

### Responsividade
Mobile-first, testado em 320px, 768px e 1920px.

---

**Próximo Passo**: Implementar Fase 1 (Services e Dados)
