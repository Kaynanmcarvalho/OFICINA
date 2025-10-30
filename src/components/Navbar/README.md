# Navbar Premium - TORQ

Navbar de nível premium com design Apple-like, glassmorphism e animações fluidas.

## Características

- **Glassmorphism**: Efeito de vidro translúcido com backdrop-blur
- **Logo Dinâmica**: Troca automaticamente entre modo claro/escuro
- **Animações Suaves**: Usando Framer Motion para transições elegantes
- **Efeito de Brilho**: Reflexo laranja animado na logo ao hover
- **Responsivo**: Adapta-se perfeitamente a diferentes tamanhos de tela
- **Tema Claro/Escuro**: Alternância suave entre temas
- **Informações do Usuário**: Exibe nome e cargo com avatar
- **Botão de Logout**: Destacado em vermelho com hover animado

## Uso

```jsx
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      {/* Resto do conteúdo */}
    </div>
  );
}
```

## Requisitos

- Logos devem estar em `/public/`:
  - `logo-torq-light.png` (modo claro)
  - `logo-torq-dark.png` (modo escuro)
- Framer Motion instalado
- Lucide React para ícones
- Tailwind CSS configurado com dark mode

## Personalização

### Alterar informações do usuário

Edite o objeto `user` no componente ou conecte a um contexto/store:

```jsx
const user = {
  name: 'Seu Nome',
  role: 'Seu Cargo'
};
```

### Implementar logout

Adicione sua lógica no `handleLogout`:

```jsx
const handleLogout = () => {
  // Sua lógica de logout aqui
  authStore.logout();
  navigate('/login');
};
```

### Implementar busca

Expanda o modal de busca em `isSearchOpen` com sua lógica de pesquisa.

## Estrutura

```
Navbar/
├── Navbar.jsx       # Componente principal
├── index.js         # Export
└── README.md        # Documentação
```

## Design

O Navbar segue os princípios de design da Apple:
- Minimalismo e clareza
- Atenção aos detalhes
- Animações significativas
- Hierarquia visual clara
- Espaçamento generoso
- Tipografia elegante
