/**
 * EmpresaContext - Contexto Global Multi-Tenant
 * 
 * Gerencia dados da empresa ativa (tenant) e prove para toda aplicação
 * Carrega automaticamente após autenticação do usuário
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { 
  isImpersonating, 
  getImpersonatedEmpresaId,
  getOriginalEmpresaId 
} from '../services/impersonationService';

const EmpresaContext = createContext(null);

// Tema padrão Torq
const getDefaultTheme = () => ({
  corPrimaria: '#F28C1D', // Laranja Torq
  corSecundaria: '#007AFF', // Azul
  corFundo: '#FFFFFF',
  gradiente: ['#F28C1D', '#FF6B35', '#F28C1D'],
  borderRadius: '12px',
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
});

// Sanitizar tema para evitar XSS
// eslint-disable-next-line no-unused-vars
const sanitizeTema = (tema) => {
  if (!tema) return getDefaultTheme();
  
  const defaultTheme = getDefaultTheme();
  
  return {
    corPrimaria: tema.corPrimaria || defaultTheme.corPrimaria,
    corSecundaria: tema.corSecundaria || defaultTheme.corSecundaria,
    corFundo: tema.corFundo || defaultTheme.corFundo,
    gradiente: Array.isArray(tema.gradiente) ? tema.gradiente : defaultTheme.gradiente,
    borderRadius: tema.borderRadius || defaultTheme.borderRadius,
    shadows: tema.shadows || defaultTheme.shadows
  };
};

export const EmpresaProvider = ({ children }) => {
  const { user } = useAuthStore();
  const [empresaData, setEmpresaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      loadEmpresaData();
    } else {
      setIsLoading(false);
      setEmpresaData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadEmpresaData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[EmpresaContext] Loading empresa data for user:', user.uid);

      // VERIFICAR SE ESTÁ EM MODO IMPERSONATION
      const impersonating = isImpersonating();
      let empresaId;
      let userData = {};
      let isSuperAdmin = false;

      if (impersonating) {
        // Modo Impersonation: usar empresa impersonada
        empresaId = getImpersonatedEmpresaId();
        const originalEmpresaId = getOriginalEmpresaId();
        
        console.log('[EmpresaContext] 🎭 IMPERSONATION MODE ACTIVE');
        console.log('[EmpresaContext] Original empresa:', originalEmpresaId);
        console.log('[EmpresaContext] Impersonated empresa:', empresaId);

        // DEFINIR empresaId IMEDIATAMENTE no sessionStorage
        sessionStorage.setItem('empresaId', empresaId);

        // Buscar dados do Super Admin (sempre em 'users')
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          userData = userDoc.data();
        }

        // Forçar permissões de super admin durante impersonation
        userData.role = 'super-admin';
        userData.permissoes = ['all'];
        userData.isImpersonating = true;
        userData.originalEmpresaId = originalEmpresaId;
        isSuperAdmin = true;

      } else {
        // Modo Normal: verificar se é Super Admin ou usuário de empresa
        
        // 1. PRIMEIRO: Verificar se está na coleção 'users' (Super Admins)
        const superAdminDocRef = doc(db, 'users', user.uid);
        const superAdminDoc = await getDoc(superAdminDocRef);
        
        if (superAdminDoc.exists()) {
          // É UM SUPER ADMIN (dono do SaaS)
          userData = superAdminDoc.data();
          isSuperAdmin = true;
          empresaId = null; // Super Admins não têm empresaId - acessam dados da raiz
          
          console.log('[EmpresaContext] 🌟 SUPER ADMIN detectado');
          console.log('[EmpresaContext] Email:', userData.email);
          console.log('[EmpresaContext] Acesso: Dados da raiz (estrutura antiga)');
          
          // Garantir que não há empresaId no sessionStorage
          sessionStorage.removeItem('empresaId');
          
        } else {
          // 2. SEGUNDO: Verificar se está na coleção 'usuarios' (Empresas Clientes)
          const clientUserDocRef = doc(db, 'usuarios', user.uid);
          const clientUserDoc = await getDoc(clientUserDocRef);
          
          if (clientUserDoc.exists()) {
            // É UM USUÁRIO DE EMPRESA CLIENTE
            userData = clientUserDoc.data();
            empresaId = userData.empresaId;
            isSuperAdmin = false;
            
            console.log('[EmpresaContext] 🏢 Usuário de Empresa Cliente detectado');
            console.log('[EmpresaContext] Email:', userData.email);
            console.log('[EmpresaContext] empresaId:', empresaId);
            
            if (!empresaId) {
              throw new Error('Usuário de empresa sem empresaId definido');
            }
            
          } else {
            // Usuário não encontrado em nenhuma coleção
            console.error('[EmpresaContext] Usuário não encontrado em "users" nem "usuarios"');
            throw new Error('Usuário não cadastrado no sistema. Entre em contato com o suporte.');
          }
        }
      }

      // 2. VALIDAÇÃO E ARMAZENAMENTO
      if (empresaId) {
        // Usuário de Empresa Cliente - validar e armazenar empresaId
        if (typeof empresaId !== 'string' || empresaId.trim().length === 0) {
          throw new Error('empresaId inválido recebido do usuário');
        }
        
        // Validar formato (apenas alfanumérico, hífen e underscore)
        if (!/^[a-zA-Z0-9_-]+$/.test(empresaId)) {
          throw new Error('empresaId contém caracteres inválidos');
        }
        
        sessionStorage.setItem('empresaId', empresaId);
        console.log('[EmpresaContext] empresaId stored in sessionStorage:', empresaId);
      } else {
        // Super Admin - garantir que não há empresaId
        sessionStorage.removeItem('empresaId');
        console.log('[EmpresaContext] Super Admin - sem empresaId (acessa dados da raiz)');
      }

      // 3. Carregar configuração da empresa ou usar padrão para Super Admins
      let empresaConfig = {};
      let temaConfig = getDefaultTheme();
      
      if (empresaId) {
        // USUÁRIO DE EMPRESA CLIENTE - Carregar dados da empresa
        const empresaDocRef = doc(db, 'empresas', empresaId);
        const empresaDoc = await getDoc(empresaDocRef);

        if (!empresaDoc.exists()) {
          throw new Error('Empresa não encontrada no sistema');
        }

        empresaConfig = empresaDoc.data();
        
        // VALIDAÇÃO: Verificar se empresa está ativa
        if (empresaConfig.ativo === false) {
          sessionStorage.removeItem('empresaId');
          throw new Error('Empresa desativada. Entre em contato com o suporte.');
        }
        
        console.log('[EmpresaContext] Empresa config:', empresaConfig);

        // Carregar tema da empresa
        const temaDocRef = doc(db, `empresas/${empresaId}/configuracoes`, 'tema');
        const temaDoc = await getDoc(temaDocRef);
        temaConfig = temaDoc.exists() ? temaDoc.data() : getDefaultTheme();
        
      } else if (isSuperAdmin) {
        // SUPER ADMIN - Usar configuração padrão
        console.log('[EmpresaContext] Super Admin - usando configuração padrão Torq');
        empresaConfig = {
          nomeFantasia: 'Torq - Administração SaaS',
          razaoSocial: 'Torq Sistemas',
          cnpj: '',
          slug: 'torq-admin',
          plano: 'premium',
          ativo: true
        };
      }
      
      // VALIDAÇÃO: Sanitizar tema para evitar XSS
      const sanitizedTema = sanitizeTema(temaConfig);

      // 4. Montar dados completos
      const empresaCompleta = {
        empresaId: empresaId || null,
        nomeFantasia: empresaConfig.nomeFantasia || 'Torq',
        razaoSocial: empresaConfig.razaoSocial || '',
        cnpj: empresaConfig.cnpj || '',
        slug: empresaConfig.slug || '',
        logo: empresaConfig.logo || null,
        tema: sanitizedTema,
        plano: empresaConfig.plano || 'premium',
        ativo: empresaConfig.ativo !== false,
        permissoes: userData.permissoes || (isSuperAdmin ? ['all'] : []),
        role: userData.role || (isSuperAdmin ? 'super-admin' : 'atendente'),
        isImpersonating: userData.isImpersonating || false,
        originalEmpresaId: userData.originalEmpresaId || null,
        isSuperAdmin: isSuperAdmin,
        isLoading: false,
        error: null,
        refreshEmpresa: loadEmpresaData
      };

      setEmpresaData(empresaCompleta);
      setIsLoading(false);

      console.log('[EmpresaContext] Empresa loaded successfully:', empresaCompleta);

      // Aplicar tema sanitizado
      applyTheme(sanitizedTema);

    } catch (err) {
      console.error('[EmpresaContext] Error loading empresa:', err);
      setError(err);
      setIsLoading(false);
      
      toast.error('Erro ao carregar dados da empresa', {
        icon: '❌',
        duration: 4000
      });
    }
  };



  /**
   * Sanitiza tema para prevenir XSS via CSS injection
   * @param {Object} tema - Tema original
   * @returns {Object} Tema sanitizado
   */
   
  const sanitizeTema = (tema) => {
    const sanitizeColor = (color) => {
      if (!color || typeof color !== 'string') return '#000000';
      
      // Permitir apenas hex colors (#RGB ou #RRGGBB) e rgb/rgba
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;
      
      if (hexRegex.test(color) || rgbRegex.test(color)) {
        return color;
      }
      
      console.warn('[EmpresaContext] Invalid color format, using default:', color);
      return '#000000';
    };
    
    const sanitizeGradient = (gradiente) => {
      if (!Array.isArray(gradiente)) return ['#F28C1D', '#FF6B35'];
      
      return gradiente
        .slice(0, 5) // Máximo 5 cores
        .map(sanitizeColor);
    };
    
    return {
      corPrimaria: sanitizeColor(tema.corPrimaria),
      corSecundaria: sanitizeColor(tema.corSecundaria),
      corFundo: sanitizeColor(tema.corFundo),
      gradiente: sanitizeGradient(tema.gradiente),
      borderRadius: tema.borderRadius || '12px',
      shadows: tema.shadows || getDefaultTheme().shadows
    };
  };

  const applyTheme = (tema) => {
    const root = document.documentElement;

    // Aplicar CSS variables (já sanitizadas)
    root.style.setProperty('--color-primary', tema.corPrimaria);
    root.style.setProperty('--color-secondary', tema.corSecundaria);
    root.style.setProperty('--color-background', tema.corFundo);
    
    if (tema.gradiente && tema.gradiente.length > 0) {
      root.style.setProperty(
        '--gradient-primary',
        `linear-gradient(135deg, ${tema.gradiente.join(', ')})`
      );
    }

    // Aplicar shadows
    if (tema.shadows) {
      root.style.setProperty('--shadow-sm', tema.shadows.sm);
      root.style.setProperty('--shadow-md', tema.shadows.md);
      root.style.setProperty('--shadow-lg', tema.shadows.lg);
      root.style.setProperty('--shadow-xl', tema.shadows.xl);
    }

    // Aplicar border radius
    if (tema.borderRadius) {
      root.style.setProperty('--border-radius', tema.borderRadius);
    }

    console.log('[EmpresaContext] Theme applied:', tema);
  };

  const value = empresaData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Carregando empresa...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Erro ao carregar empresa
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error.message}
          </p>
          <button
            onClick={loadEmpresaData}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <EmpresaContext.Provider value={value}>
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => {
  const context = useContext(EmpresaContext);
  
  if (context === undefined) {
    throw new Error('useEmpresa must be used within EmpresaProvider');
  }
  
  return context;
};

export default EmpresaContext;
