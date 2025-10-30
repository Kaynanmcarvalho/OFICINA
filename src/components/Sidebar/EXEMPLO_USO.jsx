/**
 * EXEMPLO DE USO - Sidebar Apple Premium
 * 
 * Este arquivo demonstra diferentes formas de usar o componente SidebarAppleLike
 */

import { SidebarAppleLike } from './SidebarAppleLike';
import { useSidebarState } from './useSidebarState';
import { useTheme } from '../../hooks/useTheme';

// ============================================
// EXEMPLO 1: Uso Básico
// ============================================
function ExemploBasico() {
  const handleLogout = async () => {
    console.log('Logout realizado');
    // Implementar lógica de logout
  };

  return (
    <div className="flex min-h-screen">
      <SidebarAppleLike 
        defaultExpanded={true}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 p-6">
        <h1>Conteúdo Principal</h1>
      </main>
    </div>
  );
}

// ============================================
// EXEMPLO 2: Com Dados do Usuário
// ============================================
function ExemploComUsuario() {
  // Simular dados do usuário (em produção, virá do Firebase Auth)
  const user = {
    name: 'João Silva',
    email: 'joao.silva@oficina.com',
    avatar: 'https://i.pravatar.cc/150?img=12'
  };

  const handleLogout = async () => {
    console.log('Logout:', user.email);
  };

  return (
    <div className="flex min-h-screen">
      <SidebarAppleLike 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 p-6">
        <h1>Bem-vindo, {user.name}!</h1>
      </main>
    </div>
  );
}

// ============================================
// EXEMPLO 3: Com Controle de Estado Externo
// ============================================
function ExemploComControleExterno() {
  const { isExpanded, toggleExpanded } = useSidebarState();

  return (
    <div className="flex min-h-screen">
      <SidebarAppleLike />
      
      <main 
        className={`
          flex-1 p-6 transition-all duration-300
          ${isExpanded ? 'ml-[240px]' : 'ml-[72px]'}
        `}
      >
        <button 
          onClick={toggleExpanded}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {isExpanded ? 'Colapsar' : 'Expandir'} Sidebar
        </button>
      </main>
    </div>
  );
}

// ============================================
// EXEMPLO 4: Com Tema Dinâmico
// ============================================
function ExemploComTema() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarAppleLike />
      
      <main className="flex-1 p-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tema Atual: {theme}
          </h1>
          
          <button 
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Alternar para {isDark ? 'Claro' : 'Escuro'}
          </button>
        </div>
      </main>
    </div>
  );
}

// ============================================
// EXEMPLO 5: Integração com Firebase Auth
// ============================================
function ExemploComFirebase() {
  // Exemplo de integração (requer configuração do Firebase)
  /*
  import { useAuthState } from 'react-firebase-hooks/auth';
  import { auth } from './firebase';
  
  const [user, loading] = useAuthState(auth);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  const userData = user ? {
    name: user.displayName || 'Usuário',
    email: user.email,
    avatar: user.photoURL
  } : undefined;
  
  const handleLogout = async () => {
    await auth.signOut();
  };
  */

  return (
    <div className="flex min-h-screen">
      <SidebarAppleLike 
        user={{
          name: 'Usuário Firebase',
          email: 'usuario@firebase.com'
        }}
        onLogout={async () => {
          // await auth.signOut();
          console.log('Firebase logout');
        }}
      />
      
      <main className="flex-1 p-6">
        <h1>Integrado com Firebase Auth</h1>
      </main>
    </div>
  );
}

// ============================================
// EXEMPLO 6: Layout Completo com Router
// ============================================
function ExemploLayoutCompleto() {
  const { isExpanded } = useSidebarState();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarAppleLike 
        defaultExpanded={true}
        user={{
          name: 'Admin',
          email: 'admin@oficina.com'
        }}
        onLogout={async () => {
          console.log('Logout');
        }}
      />
      
      {/* Área de conteúdo com ajuste automático */}
      <div 
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${isExpanded ? 'ml-[240px]' : 'ml-[72px]'}
        `}
      >
        {/* Header/Navbar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="h-full px-6 flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
        </header>
        
        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Bem-vindo ao Sistema
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              A sidebar se ajusta automaticamente ao conteúdo.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================
// EXEMPLO 7: Responsivo com Mobile
// ============================================
function ExemploResponsivo() {
  const { isExpanded, setExpanded } = useSidebarState();

  return (
    <div className="flex min-h-screen">
      <SidebarAppleLike />
      
      {/* Botão mobile para abrir sidebar */}
      <button
        onClick={() => setExpanded(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <main className="flex-1 p-6">
        <h1>Layout Responsivo</h1>
        <p>Em mobile, a sidebar vira um drawer overlay</p>
      </main>
    </div>
  );
}

// ============================================
// EXPORTAR EXEMPLOS
// ============================================
export {
  ExemploBasico,
  ExemploComUsuario,
  ExemploComControleExterno,
  ExemploComTema,
  ExemploComFirebase,
  ExemploLayoutCompleto,
  ExemploResponsivo
};

// Para testar, importe um dos exemplos no seu App.jsx:
// import { ExemploLayoutCompleto } from './components/Sidebar/EXEMPLO_USO';
// 
// function App() {
//   return <ExemploLayoutCompleto />;
// }
