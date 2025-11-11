# 🚗 Sistema de Check-in Inteligente - Torq

## 📖 Visão Geral

Sistema completo de check-in de veículos com reconhecimento automático, sugestões inteligentes e integração total com Firebase. Design premium estilo Apple/Tesla com tema claro/escuro dinâmico.

---

## ✨ Funcionalidades

### 🔍 Busca Inteligente
- Reconhecimento automático de placa
- Busca de dados do veículo via backend
- Validação de formato (antigo e Mercosul)
- Feedback visual em tempo real

### 🎨 Visual Dinâmico
- Renderização SVG por tipo (carro/moto/caminhão)
- Cor baseada nos dados reais do veículo
- Animações suaves com Framer Motion
- Adaptação automática ao tema

### 📸 Upload Inteligente de Fotos
- Captura via câmera ou galeria
- Overlay automático com cor do veículo
- Logo da marca e placa nas imagens
- Upload direto para Firebase Storage
- Preview antes do envio

### 🔧 Painel Técnico
- Especificações do veículo
- Alertas de manutenção
- Baseado em idade e quilometragem
- Dados técnicos detalhados

### ✅ Checklist Inteligente
- Específico por tipo de veículo
- Status visual (OK/Atenção/Crítico)
- Categorização de itens
- Campo de observações
- Progresso em tempo real

### 💡 Sugestões Preditivas
- Serviços recomendados automaticamente
- Baseado em ano e quilometragem
- Priorização (crítica/alta/média/baixa)
- Seleção interativa

### 📜 Histórico Automático
- Timeline de atendimentos anteriores
- Busca por placa no Firestore
- Exibição de serviços realizados
- Localização e data

### 📍 Geolocalização
- Captura automática de coordenadas
- Conversão para cidade/estado
- Registro no check-in

### 🔐 PIN de Retirada
- Geração automática de 6 dígitos
- Único por check-in
- Copiar para área de transferência
- Validação futura no checkout

---

## 📁 Estrutura de Arquivos

```
src/pages/checkin/
├── index.jsx                          # Página principal
├── components/
│   ├── PlateSearch.jsx                # Busca de placa
│   ├── VehicleInfoPanel.jsx           # Informações do veículo
│   ├── VehicleVisual.jsx              # Renderização visual
│   ├── TechnicalPanel.jsx             # Painel técnico
│   ├── PhotoUploadSection.jsx         # Upload de fotos
│   ├── ServiceSuggestions.jsx         # Sugestões de serviços
│   ├── Checklist.jsx                  # Checklist interativo
│   ├── HistoryTimeline.jsx            # Histórico
│   └── FinalizeModal.jsx              # Modal de finalização
└── data/
    ├── maintenance_data.json          # Dados de manutenção
    ├── car_specs.json                 # Especificações técnicas
    ├── service_suggestions.json       # Sugestões de serviços
    └── checklist_data.json            # Checklist por tipo

src/services/
└── vehicleDataService.js              # Utilitários de veículos
```

---

## 🚀 Como Usar

### 1. Instalação
```bash
# Já está instalado no projeto Torq
# Certifique-se que as dependências estão atualizadas
npm install
```

### 2. Configuração
```javascript
// Adicione a rota no App.jsx
import CheckinPage from './pages/checkin';

<Route path="/checkin" element={<CheckinPage />} />
```

### 3. Acesso
```
http://localhost:5173/checkin
```

### 4. Fluxo de Uso
1. Digite a placa do veículo
2. Sistema busca dados automaticamente
3. Adicione fotos (obrigatório)
4. Selecione serviços (opcional)
5. Preencha checklist (opcional)
6. Finalize e obtenha o PIN

---

## 💾 Estrutura de Dados

### Firestore - Collection: `checkins`
```javascript
{
  empresaId: string,
  placa: string,
  marca: string,
  modelo: string,
  ano: string,
  cor: string,
  fotosEntrada: string[],
  servicosSelecionados: string[],
  checklist: array[{
    id: string,
    item: string,
    status: 'ok' | 'atencao' | 'critico',
    observacao: string
  }],
  localizacao: {
    cidade: string,
    estado: string,
    latitude: number,
    longitude: number
  },
  pinRetirada: string,
  observacoes: string,
  dataHora: timestamp,
  status: 'em_atendimento' | 'concluido',
  criadoEm: timestamp
}
```

### Storage - Path: `/checkins/{placa}/{data}/entrada/`
```
foto1.jpg
foto2.jpg
...
```

---

## 🎨 Design System

### Cores por Status
- **OK**: Verde (#16A34A)
- **Atenção**: Amarelo (#EAB308)
- **Crítico**: Vermelho (#DC2626)
- **Info**: Azul (#2563EB)

### Tema Dinâmico
- Adaptação automática claro/escuro
- Usa variáveis CSS globais
- Contraste otimizado

### Animações
- Framer Motion em todos os componentes
- Transições suaves (300-500ms)
- Feedback visual em ações

---

## 🔧 Tecnologias

- **React 18** - Framework principal
- **Vite** - Build tool
- **Firebase Firestore** - Banco de dados
- **Firebase Storage** - Armazenamento de fotos
- **Framer Motion** - Animações
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Nominatim API** - Geolocalização reversa

---

## 📚 Documentação Adicional

- [CHECKIN_ENTREGA_FINAL.md](./CHECKIN_ENTREGA_FINAL.md) - Documentação completa
- [TESTAR_CHECKIN_AGORA.md](./TESTAR_CHECKIN_AGORA.md) - Guia de testes
- [CHECKIN_INTEGRACAO_SISTEMA.md](./CHECKIN_INTEGRACAO_SISTEMA.md) - Integração com outros módulos
- [CHECKIN_STATUS_IMPLEMENTACAO.md](./CHECKIN_STATUS_IMPLEMENTACAO.md) - Status da implementação
- [CHECKIN_PREMIUM_ARQUITETURA.md](./CHECKIN_PREMIUM_ARQUITETURA.md) - Arquitetura detalhada

---

## ✅ Validações

### Obrigatórios
- ✅ Placa válida (formato brasileiro)
- ✅ Pelo menos 1 foto

### Opcionais
- Serviços selecionados
- Checklist preenchido
- Observações

---

## 🔐 Segurança

### Firestore Rules
```javascript
match /checkins/{checkinId} {
  allow read, write: if request.auth != null 
    && request.auth.token.empresaId == resource.data.empresaId;
}
```

### Storage Rules
```javascript
match /checkins/{placa}/{allPaths=**} {
  allow read: if request.auth != null;
  allow write: if request.auth != null 
    && request.resource.size < 5 * 1024 * 1024;
}
```

---

## 🐛 Troubleshooting

### Problema: Dados não carregam
**Solução**: Verifique se o backend está rodando e acessível

### Problema: Upload de fotos falha
**Solução**: Verifique permissões do Firebase Storage

### Problema: Geolocalização não funciona
**Solução**: 
- Permita acesso no navegador
- Use HTTPS ou localhost
- API Nominatim pode estar lenta

### Problema: Histórico vazio
**Solução**: Verifique índices do Firestore e empresaId

---

## 🎯 Próximas Melhorias

### Curto Prazo
- [ ] Sistema de checkout com validação de PIN
- [ ] Impressão de comprovante
- [ ] Assinatura digital do cliente

### Médio Prazo
- [ ] Dashboard de check-ins
- [ ] Relatórios e estatísticas
- [ ] Notificações automáticas

### Longo Prazo
- [ ] App mobile nativo
- [ ] Reconhecimento de placa por foto
- [ ] IA para sugestões mais precisas

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação completa
2. Verifique o console do navegador (F12)
3. Confirme configurações do Firebase
4. Teste com dados de exemplo

---

## 📄 Licença

Parte do sistema Torq - Todos os direitos reservados

---

## 🎉 Status

**✅ Sistema 100% funcional e pronto para produção!**

Implementado com:
- ✅ Todas as funcionalidades solicitadas
- ✅ Design premium
- ✅ Integração real com Firebase
- ✅ Tema dinâmico
- ✅ Responsivo
- ✅ Código limpo e modular

**Pronto para uso! 🚀**
