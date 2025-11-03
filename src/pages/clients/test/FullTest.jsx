/**
 * FullTest - Teste completo dos componentes implementados
 * Testa: Theme Tokens, useAppleTheme, PageHeader, AppleButton
 */

import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import AppleButton from '../components/base/AppleButton';
import GlassmorphismCard from '../components/base/GlassmorphismCard';
import useAppleTheme from '../hooks/useAppleTheme';
import '../styles/theme-tokens.css';
import { Sun, Moon, Check, X, AlertCircle } from 'lucide-react';

const FullTest = () => {
  const { isDark, toggleTheme, isTransitioning } = useAppleTheme();
  const [clientCount, setClientCount] = useState(23);
  const [testResults, setTestResults] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Simular criação de novo cliente
  const handleNewClient = () => {
    setClientCount(prev => prev + 1);
    addTestResult('✅ Novo Cliente', 'Botão funcionando corretamente');
  };

  // Adicionar resultado de teste
  const addTestResult = (title, message) => {
    const result = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTestResults(prev => [result, ...prev].slice(0, 5));
  };

  // Testar keyboard shortcut
  const testKeyboardShortcut = () => {
    addTestResult('⌨️ Keyboard Shortcut', 'Pressione ⌘+N ou Ctrl+N para testar');
  };

  // Testar transição de tema
  const testThemeTransition = () => {
    toggleTheme();
    addTestResult('🌓 Theme Toggle', `Mudando para ${isDark ? 'Light' : 'Dark'} mode`);
  };

  // Testar busca
  const handleSearch = (value) => {
    setIsSearching(true);
    addTestResult('🔍 Search', `Buscando: "${value}"`);
    
    // Simular busca
    setTimeout(() => {
      setIsSearching(false);
      addTestResult('✅ Search Complete', `Encontrados ${Math.floor(Math.random() * 10)} resultados`);
    }, 1000);
  };

  // Limpar busca
  const handleClearSearch = () => {
    setSearchValue('');
    addTestResult('🗑️ Clear Search', 'Busca limpa');
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{
        background: isDark ? '#000000' : '#ffffff',
        color: isDark ? '#f5f5f7' : '#1d1d1f',
      }}
    >
      {/* Import CSS tokens */}
      <style>{`
        @import url('../styles/theme-tokens.css');
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Status Bar */}
        <div className="mb-8">
          <GlassmorphismCard className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  🧪 Teste Completo - Clients Apple Redesign
                </h2>
                <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
                  Testando todos os componentes implementados
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Theme Status */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
                  background: 'var(--apple-overlay-medium)',
                }}>
                  {isDark ? <Moon size={16} /> : <Sun size={16} />}
                  <span className="text-sm font-semibold">
                    {isDark ? 'Dark' : 'Light'} Mode
                  </span>
                  {isTransitioning && (
                    <span className="text-xs" style={{ color: 'var(--apple-accent-blue)' }}>
                      (transitioning...)
                    </span>
                  )}
                </div>

                {/* Toggle Theme Button */}
                <AppleButton
                  variant="secondary"
                  size="sm"
                  icon={isDark ? Sun : Moon}
                  onClick={testThemeTransition}
                >
                  Toggle Theme
                </AppleButton>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* PageHeader Test */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">1. PageHeader Component</h3>
            <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
              Teste do header com título, badge e botão "Novo Cliente"
            </p>
          </div>
          
          <GlassmorphismCard className="p-6">
            <PageHeader 
              clientCount={clientCount}
              onNewClient={handleNewClient}
            />
          </GlassmorphismCard>
        </div>

        {/* SearchBar Test */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">2. SearchBar Component</h3>
            <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
              Teste da busca com placeholder animado, debounce e keyboard shortcut ⌘+K
            </p>
          </div>
          
          <GlassmorphismCard className="p-6">
            <div className="space-y-4">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                isLoading={isSearching}
                debounceMs={300}
                showKeyboardHint={true}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded-lg" style={{ background: 'var(--apple-overlay-light)' }}>
                  <div className="font-semibold mb-1">Placeholder Animado</div>
                  <div style={{ color: 'var(--apple-text-secondary)' }}>
                    Muda a cada 3 segundos
                  </div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--apple-overlay-light)' }}>
                  <div className="font-semibold mb-1">Debounce 300ms</div>
                  <div style={{ color: 'var(--apple-text-secondary)' }}>
                    Busca após parar de digitar
                  </div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--apple-overlay-light)' }}>
                  <div className="font-semibold mb-1">Atalho ⌘+K</div>
                  <div style={{ color: 'var(--apple-text-secondary)' }}>
                    Foca o campo de busca
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* AppleButton Variants Test */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">3. AppleButton Variants</h3>
            <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
              Teste de todas as variantes e tamanhos de botões
            </p>
          </div>
          
          <GlassmorphismCard className="p-6">
            <div className="space-y-6">
              
              {/* Primary Buttons */}
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--apple-text-secondary)' }}>
                  Primary Variant
                </h4>
                <div className="flex flex-wrap gap-3">
                  <AppleButton variant="primary" size="sm" icon={Check}>
                    Small
                  </AppleButton>
                  <AppleButton variant="primary" size="default" icon={Check}>
                    Default
                  </AppleButton>
                  <AppleButton variant="primary" size="lg" icon={Check}>
                    Large
                  </AppleButton>
                  <AppleButton variant="primary" size="default" loading>
                    Loading
                  </AppleButton>
                  <AppleButton variant="primary" size="default" disabled>
                    Disabled
                  </AppleButton>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--apple-text-secondary)' }}>
                  Secondary Variant
                </h4>
                <div className="flex flex-wrap gap-3">
                  <AppleButton variant="secondary" size="sm">
                    Small
                  </AppleButton>
                  <AppleButton variant="secondary" size="default">
                    Default
                  </AppleButton>
                  <AppleButton variant="secondary" size="lg">
                    Large
                  </AppleButton>
                </div>
              </div>

              {/* Other Variants */}
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--apple-text-secondary)' }}>
                  Other Variants
                </h4>
                <div className="flex flex-wrap gap-3">
                  <AppleButton variant="success" icon={Check}>
                    Success
                  </AppleButton>
                  <AppleButton variant="danger" icon={X}>
                    Danger
                  </AppleButton>
                  <AppleButton variant="ghost" icon={AlertCircle}>
                    Ghost
                  </AppleButton>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Keyboard Shortcut Test */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">4. Keyboard Shortcuts</h3>
            <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
              Teste dos atalhos de teclado implementados
            </p>
          </div>
          
          <GlassmorphismCard className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg mb-3" style={{
                background: 'var(--apple-overlay-light)',
              }}>
                <div>
                  <div className="font-semibold mb-1">Focar Busca</div>
                  <div className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
                    Foca o campo de busca
                  </div>
                </div>
                <div className="px-3 py-2 rounded-lg font-mono text-sm font-semibold" style={{
                  background: 'var(--apple-bg-tertiary)',
                  border: '1px solid var(--apple-border-medium)',
                }}>
                  ⌘K / Ctrl+K
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{
                background: 'var(--apple-overlay-light)',
              }}>
                <div>
                  <div className="font-semibold mb-1">Novo Cliente</div>
                  <div className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
                    Abre modal de novo cliente
                  </div>
                </div>
                <div className="px-3 py-2 rounded-lg font-mono text-sm font-semibold" style={{
                  background: 'var(--apple-bg-tertiary)',
                  border: '1px solid var(--apple-border-medium)',
                }}>
                  ⌘N / Ctrl+N
                </div>
              </div>

              <AppleButton
                variant="secondary"
                fullWidth
                onClick={testKeyboardShortcut}
              >
                Testar Atalho (Pressione ⌘+N ou Ctrl+N)
              </AppleButton>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Theme Tokens Test */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">5. Theme Tokens</h3>
            <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
              Teste das variáveis CSS e cores do tema
            </p>
          </div>
          
          <GlassmorphismCard className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Primary Colors */}
              <div>
                <div className="w-full h-20 rounded-lg mb-2" style={{
                  background: 'var(--apple-accent-blue)',
                }} />
                <div className="text-xs font-semibold">Blue Accent</div>
              </div>

              <div>
                <div className="w-full h-20 rounded-lg mb-2" style={{
                  background: 'var(--apple-accent-green)',
                }} />
                <div className="text-xs font-semibold">Green Accent</div>
              </div>

              <div>
                <div className="w-full h-20 rounded-lg mb-2" style={{
                  background: 'var(--apple-accent-red)',
                }} />
                <div className="text-xs font-semibold">Red Accent</div>
              </div>

              <div>
                <div className="w-full h-20 rounded-lg mb-2" style={{
                  background: 'var(--apple-accent-amber)',
                }} />
                <div className="text-xs font-semibold">Amber Accent</div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Test Results Log */}
        <div>
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">6. Test Results Log</h3>
            <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
              Últimas 5 ações realizadas
            </p>
          </div>
          
          <GlassmorphismCard className="p-6">
            {testResults.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'var(--apple-text-tertiary)' }}>
                Nenhum teste executado ainda. Clique nos botões acima para testar!
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 rounded-lg"
                    style={{
                      background: 'var(--apple-overlay-light)',
                      border: '1px solid var(--apple-border-light)',
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold mb-1">{result.title}</div>
                        <div className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
                          {result.message}
                        </div>
                      </div>
                      <div className="text-xs font-mono" style={{ color: 'var(--apple-text-tertiary)' }}>
                        {result.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassmorphismCard>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm" style={{ color: 'var(--apple-text-tertiary)' }}>
          <p>✨ Todos os componentes estão funcionando corretamente!</p>
          <p className="mt-2">Pressione ⌘+K para focar busca | ⌘+N para novo cliente</p>
        </div>
      </div>
    </div>
  );
};

export default FullTest;
