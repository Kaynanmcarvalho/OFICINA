# Sistema de Gestão para Oficina de Motos

Um sistema completo de gestão para oficinas de motocicletas, desenvolvido com React, Firebase e TailwindCSS.

## 🚀 Funcionalidades

### 📋 Check-in/Check-out
- Sistema de entrada e saída de motocicletas
- Geração e leitura de QR codes
- Upload de fotos do veículo
- Histórico completo de serviços

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Histórico de serviços por cliente
- Gestão de veículos por cliente
- Busca avançada e filtros

### 📦 Controle de Estoque
- Gestão de peças e componentes
- Controle de entrada e saída
- Alertas de estoque baixo
- Relatórios de movimentação

### 🏍️ Montagem de Motos
- Acompanhamento de projetos de montagem
- Controle de peças utilizadas
- Log de trabalho e progresso
- Galeria de fotos do projeto

### 🔧 Gestão de Ferramentas
- Controle de ferramentas e equipamentos
- Sistema de empréstimo/devolução
- Manutenção preventiva
- Localização de ferramentas

### 👨‍🔧 Gestão de Equipe
- Cadastro de funcionários
- Controle de horários e escalas
- Gestão de habilidades e certificações
- Relatórios de produtividade

### 📅 Agendamento
- Sistema de agendamento de serviços
- Calendário integrado
- Notificações automáticas
- Gestão de disponibilidade

### 📊 Dashboard e Relatórios
- Métricas em tempo real
- Gráficos de performance
- Relatórios financeiros
- Análise de produtividade

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, Vite
- **Roteamento**: React Router DOM
- **Estado Global**: Zustand
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Estilização**: TailwindCSS
- **Animações**: Framer Motion
- **Formulários**: React Hook Form + Zod
- **Internacionalização**: React i18next
- **Notificações**: React Hot Toast
- **Gráficos**: Recharts
- **QR Code**: qrcode + html5-qrcode
- **Tabelas**: TanStack Table
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Conta no Firebase

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd oficina
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative Authentication, Firestore e Storage
   - Copie as configurações do Firebase
   - Edite o arquivo `src/config/firebase.js` com suas credenciais

4. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações do Firebase.

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código com Prettier
- `npm run format:check` - Verifica a formatação do código

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface
│   ├── layout/         # Componentes de layout
│   ├── auth/           # Componentes de autenticação
│   └── forms/          # Componentes de formulários
├── pages/              # Páginas da aplicação
├── store/              # Gerenciamento de estado (Zustand)
├── config/             # Configurações (Firebase, etc.)
├── i18n/               # Internacionalização
│   └── locales/        # Arquivos de tradução
├── utils/              # Funções utilitárias
├── hooks/              # Custom hooks
└── styles/             # Estilos globais
```

## 🌐 Internacionalização

O sistema suporta múltiplos idiomas:
- Português (pt-BR) - Padrão
- Inglês (en-US)
- Espanhol (es-ES)

Para adicionar um novo idioma:
1. Crie um arquivo JSON em `src/i18n/locales/`
2. Adicione as traduções seguindo a estrutura existente
3. Atualize a configuração em `src/i18n/index.js`

## 🎨 Temas

O sistema suporta:
- Tema claro
- Tema escuro
- Tema automático (baseado na preferência do sistema)

## 🔐 Autenticação

Sistema de autenticação com Firebase Auth:
- Login com email/senha
- Login com Google
- Registro de novos usuários
- Recuperação de senha
- Controle de permissões por função

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- Desktop
- Tablet
- Mobile

## 🚀 Deploy

Para fazer o deploy:

1. **Build de produção**
   ```bash
   npm run build
   ```

2. **Deploy no Firebase Hosting** (opcional)
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@oficina.com

## 🔄 Changelog

### v1.0.0
- Lançamento inicial
- Sistema completo de gestão para oficinas
- Todas as funcionalidades principais implementadas

---

**Desenvolvido com ❤️ para oficinas de motocicletas**