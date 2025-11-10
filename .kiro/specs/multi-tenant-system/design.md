# Design Document - Sistema Multi-Tenant Torq

## Overview

Este documento detalha a arquitetura técnica, componentes, fluxos de dados e decisões de design para implementação do sistema multi-tenant no Torq. O design prioriza isolamento de dados, performance, experiência visual premium e escalabilidade.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ EmpresaContext│  │ ThemeProvider│  │ AuthProvider │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Firebase Auth│  │   Firestore  │  │   Storage    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Firestore Data Structure                    │
│                                                              │
│  /empresas/{empresaId}/                                     │
│    ├─ clientes/                                             │
│    ├─ veiculos/                                             │
│    ├─ orcamentos/                                           │
│    ├─ checkins/                                             │
│    ├─ usuarios/                                             │
│    ├─ whatsapp_session/                                     │
│    └─ configuracoes/                                        │
│                                                              │
│  /cache_placas/{placa}  (Global - Shared)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌──────────┐     Login      ┌──────────────┐
│  User    │ ──────────────▶│ Firebase Auth│
└──────────┘                └──────────────┘
     │                             │
     │                             ▼
     │                      ┌──────────────┐
     │                      │ Get User Doc │
     │                      │ /usuarios/   │
     │                      └──────────────┘
     │                             │
     │                             ▼
     │                      ┌──────────────┐
     │                      │ Extract      │
     │                      │ empresaId    │
     │                      └──────────────┘
     │                             │
     │                             ▼
     │                      ┌──────────────┐
     │                      │ Load Empresa │
     │                      │ Config       │
     │                      └──────────────┘
     │                             │
     │                             ▼
     │                      ┌──────────────┐
     │                      │ Set Context  │
     │                      │ + Theme      │
     │                      └──────────────┘
     │                             │
     └─────────────────────────────┘
                  │
                  ▼
          ┌──────────────┐
          │ App Ready    │
          │ with Tenant  │
          └──────────────┘
```

## Components and Interfaces

### 1. EmpresaContext (React Context)

**Purpose**: Armazenar e prover dados da empresa ativa para toda a aplicação.

**Interface**:
```typescript
interface EmpresaContextType {
  empresaId: string;
  nomeFantasia: string;
  slug: string;
  logo: string | null;
  tema: {
    corPrimaria: string;
    corSecundaria: string;
    corFundo: string;
    gradiente: string[];
  };
  plano: 'basico' | 'premium' | 'enterprise';
  permissoes: string[];
  isLoading: boolean;
  error: Error | null;
  refreshEmpresa: () => Promise<void>;
}
```

**Implementation**:
```typescript
// src/contexts/EmpresaContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const EmpresaContext = createContext<EmpresaContextType | null>(null);

export const EmpresaProvider = ({ children }) => {
  const { user } = useAuth();
  const [empresaData, setEmpresaData] = useState<EmpresaContextType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      loadEmpresaData();
    }
  }, [user]);

  const loadEmpresaData = async () => {
    try {
      setIsLoading(true);
      
      // 1. Get user document to find empresaId
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      const userData = userDoc.data();
      
      if (!userData?.empresaId) {
        throw new Error('Usuário não vinculado a nenhuma empresa');
      }
      
      const empresaId = userData.empresaId;
      
      // 2. Store empresaId in sessionStorage
      sessionStorage.setItem('empresaId', empresaId);
      
      // 3. Load empresa configuration
      const empresaDoc = await getDoc(doc(db, 'empresas', empresaId));
      const empresaConfig = empresaDoc.data();
      
      // 4. Load empresa theme
      const configDoc = await getDoc(
        doc(db, `empresas/${empresaId}/configuracoes`, 'tema')
      );
      const temaConfig = configDoc.data();
      
      setEmpresaData({
        empresaId,
        nomeFantasia: empresaConfig?.nomeFantasia || 'Empresa',
        slug: empresaConfig?.slug || '',
        logo: empresaConfig?.logo || null,
        tema: temaConfig || getDefaultTheme(),
        plano: empresaConfig?.plano || 'basico',
        permissoes: userData.permissoes || [],
        isLoading: false,
        error: null,
        refreshEmpresa: loadEmpresaData
      });
      
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  return (
    <EmpresaContext.Provider value={empresaData}>
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => {
  const context = useContext(EmpresaContext);
  if (!context) {
    throw new Error('useEmpresa must be used within EmpresaProvider');
  }
  return context;
};
```

### 2. ThemeProvider (Dynamic Theming)

**Purpose**: Aplicar tema dinâmico baseado nas configurações da empresa.

**Interface**:
```typescript
interface ThemeConfig {
  corPrimaria: string;
  corSecundaria: string;
  corFundo: string;
  gradiente: string[];
  borderRadius: string;
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
```

**Implementation**:
```typescript
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useEffect } from 'react';
import { useEmpresa } from './EmpresaContext';

export const ThemeProvider = ({ children }) => {
  const { tema } = useEmpresa();

  useEffect(() => {
    if (tema) {
      applyTheme(tema);
    }
  }, [tema]);

  const applyTheme = (tema: ThemeConfig) => {
    const root = document.documentElement;
    
    // Apply CSS variables
    root.style.setProperty('--color-primary', tema.corPrimaria);
    root.style.setProperty('--color-secondary', tema.corSecundaria);
    root.style.setProperty('--color-background', tema.corFundo);
    root.style.setProperty('--gradient-primary', 
      `linear-gradient(135deg, ${tema.gradiente.join(', ')})`
    );
    
    // Apply shadows
    root.style.setProperty('--shadow-sm', tema.shadows.sm);
    root.style.setProperty('--shadow-md', tema.shadows.md);
    root.style.setProperty('--shadow-lg', tema.shadows.lg);
    root.style.setProperty('--shadow-xl', tema.shadows.xl);
  };

  return <>{children}</>;
};
```

### 3. Firestore Service Layer

**Purpose**: Centralizar todas as operações do Firestore com empresaId automático.

**Implementation**:
```typescript
// src/services/firestoreService.ts
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class FirestoreService {
  private getEmpresaId(): string {
    const empresaId = sessionStorage.getItem('empresaId');
    if (!empresaId) {
      throw new Error('empresaId não encontrado na sessão');
    }
    return empresaId;
  }

  private getCollectionPath(collectionName: string): string {
    const empresaId = this.getEmpresaId();
    return `empresas/${empresaId}/${collectionName}`;
  }

  async getAll<T>(collectionName: string): Promise<T[]> {
    const path = this.getCollectionPath(collectionName);
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    const path = this.getCollectionPath(collectionName);
    const docRef = doc(db, path, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as T;
  }

  async create<T>(collectionName: string, data: Partial<T>): Promise<string> {
    const path = this.getCollectionPath(collectionName);
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  }

  async update<T>(
    collectionName: string, 
    id: string, 
    data: Partial<T>
  ): Promise<void> {
    const path = this.getCollectionPath(collectionName);
    const docRef = doc(db, path, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  async delete(collectionName: string, id: string): Promise<void> {
    const path = this.getCollectionPath(collectionName);
    const docRef = doc(db, path, id);
    await deleteDoc(docRef);
  }

  async query<T>(
    collectionName: string,
    filters: Array<{ field: string; operator: any; value: any }>
  ): Promise<T[]> {
    const path = this.getCollectionPath(collectionName);
    const collectionRef = collection(db, path);
    
    let q = query(collectionRef);
    filters.forEach(filter => {
      q = query(q, where(filter.field, filter.operator, filter.value));
    });
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
}

export const firestoreService = new FirestoreService();
```

### 4. Cache de Placas Service

**Purpose**: Gerenciar cache global de consultas de placas.

**Implementation**:
```typescript
// src/services/placaCacheService.ts
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface PlacaCache {
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  timestamp: string;
}

class PlacaCacheService {
  private localCache: Map<string, PlacaCache> = new Map();

  async consultarPlaca(placa: string): Promise<PlacaCache | null> {
    // 1. Check local cache
    if (this.localCache.has(placa)) {
      return this.localCache.get(placa)!;
    }

    // 2. Check global cache
    const cacheDoc = await getDoc(doc(db, 'cache_placas', placa));
    if (cacheDoc.exists()) {
      const data = cacheDoc.data() as PlacaCache;
      this.localCache.set(placa, data);
      return data;
    }

    // 3. Call external API
    const apiData = await this.consultarPlacaAPI(placa);
    if (apiData) {
      // Save to global cache
      await setDoc(doc(db, 'cache_placas', placa), {
        ...apiData,
        timestamp: new Date().toISOString()
      });
      this.localCache.set(placa, apiData);
      return apiData;
    }

    return null;
  }

  private async consultarPlacaAPI(placa: string): Promise<PlacaCache | null> {
    // Implementation of external API call
    // This would call the actual vehicle plate API
    try {
      const response = await fetch(`/api/consultar-placa/${placa}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Erro ao consultar placa:', error);
    }
    return null;
  }

  clearLocalCache() {
    this.localCache.clear();
  }
}

export const placaCacheService = new PlacaCacheService();
```

### 5. Permission Guard Component

**Purpose**: Controlar exibição de componentes baseado em permissões.

**Implementation**:
```typescript
// src/components/PermissionGuard.tsx
import { useEmpresa } from '../contexts/EmpresaContext';
import { useAuth } from '../contexts/AuthContext';

interface PermissionGuardProps {
  requiredRole?: 'admin' | 'atendente' | 'financeiro';
  requiredPermission?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({
  requiredRole,
  requiredPermission,
  children,
  fallback = null
}: PermissionGuardProps) => {
  const { user } = useAuth();
  const { permissoes } = useEmpresa();

  const hasPermission = () => {
    if (requiredRole) {
      return user?.role === 'admin' || user?.role === requiredRole;
    }
    
    if (requiredPermission) {
      return permissoes.includes(requiredPermission);
    }
    
    return true;
  };

  return hasPermission() ? <>{children}</> : <>{fallback}</>;
};
```

## Data Models

### Empresa Model
```typescript
interface Empresa {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  slug: string;
  logo: string | null;
  plano: 'basico' | 'premium' | 'enterprise';
  ativo: boolean;
  dataCriacao: string;
  dataExpiracao: string | null;
  contato: {
    email: string;
    telefone: string;
    endereco: string;
  };
}
```

### Usuario Model
```typescript
interface Usuario {
  id: string;
  empresaId: string;
  nome: string;
  email: string;
  role: 'admin' | 'atendente' | 'financeiro';
  ativo: boolean;
  permissoes: string[];
  avatar: string | null;
  dataCriacao: string;
  ultimoAcesso: string;
}
```

### Configuracao Model
```typescript
interface Configuracao {
  empresaId: string;
  tema: {
    corPrimaria: string;
    corSecundaria: string;
    corFundo: string;
    gradiente: string[];
    borderRadius: string;
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  whatsapp: {
    token: string | null;
    sessionId: string | null;
    webhook: string | null;
    ativo: boolean;
    ultimaConexao: string | null;
  };
}
```

## Error Handling

### Error Types
```typescript
enum ErrorType {
  EMPRESA_NAO_ENCONTRADA = 'EMPRESA_NAO_ENCONTRADA',
  USUARIO_SEM_EMPRESA = 'USUARIO_SEM_EMPRESA',
  PERMISSAO_NEGADA = 'PERMISSAO_NEGADA',
  SESSAO_EXPIRADA = 'SESSAO_EXPIRADA',
  SLUG_DUPLICADO = 'SLUG_DUPLICADO',
  FIRESTORE_ERROR = 'FIRESTORE_ERROR'
}

class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Algo deu errado</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Testing Strategy

### Unit Tests
- Test EmpresaContext with different empresa configurations
- Test FirestoreService methods with mocked Firestore
- Test PlacaCacheService cache hit/miss scenarios
- Test PermissionGuard with different roles

### Integration Tests
- Test complete login flow with empresa loading
- Test theme application after empresa change
- Test data isolation between different empresas
- Test WhatsApp session management

### E2E Tests
- Test user journey from login to data access
- Test slug-based routing
- Test permission-based UI rendering
- Test offline mode and sync

## Performance Optimizations

1. **Lazy Loading**: Load empresa configuration only after authentication
2. **Memoization**: Use React.memo for expensive components
3. **Virtual Scrolling**: Implement for large lists (clientes, veículos)
4. **Image Optimization**: Compress logos to WebP format, max 200KB
5. **Code Splitting**: Split routes and load on demand
6. **Firestore Indexes**: Create composite indexes for common queries
7. **Cache Strategy**: Implement stale-while-revalidate for empresa config

## Security Considerations

1. **Firestore Rules**: Implement strict rules checking empresaId
2. **JWT Validation**: Validate empresaId in token on every request
3. **Rate Limiting**: Limit API calls per user/empresa
4. **Input Sanitization**: Sanitize all user inputs
5. **CORS Configuration**: Restrict origins to known domains
6. **Audit Logging**: Log all sensitive operations

## Migration Strategy

### Phase 1: Preparation
1. Create backup of current Firestore data
2. Create new `/empresas` collection structure
3. Test migration script on development environment

### Phase 2: Migration
1. Create default empresa for existing data
2. Move all collections under `/empresas/{defaultEmpresaId}`
3. Update all user documents with empresaId
4. Verify data integrity

### Phase 3: Validation
1. Run automated tests
2. Manual QA testing
3. Monitor error logs
4. Rollback plan if needed

## Deployment Plan

1. Deploy backend changes (Firestore rules, Cloud Functions)
2. Deploy frontend with feature flag disabled
3. Run migration script
4. Enable feature flag gradually (10%, 50%, 100%)
5. Monitor metrics and errors
6. Full rollout after 48h of stability
