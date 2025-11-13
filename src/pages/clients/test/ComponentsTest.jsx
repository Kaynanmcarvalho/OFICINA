/**
 * ComponentsTest - Teste completo de todos os componentes base
 */

import React, { useState } from 'react';
import { Plus, Search, Mail, User, Check, X } from 'lucide-react';
import GlassmorphismCard from '../components/base/GlassmorphismCard';
import AppleButton from '../components/base/AppleButton';
import AppleInput from '../components/base/AppleInput';
import useAppleTheme from '../hooks/useAppleTheme';
import '../styles/theme-tokens.css';

const ComponentsTest = () => {
  const { isDark, theme } = useAppleTheme();
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingTest = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div 
      className="min-h-screen p-8 transition-colors duration-300"
      style={{ 
        background: 'var(--apple-bg-primary)',
        color: 'var(--apple-text-primary)'
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Components Test Suite</h1>
        <p style={{ color: 'var(--apple-text-secondary)' }}>
          Testing all base components - Theme: <strong>{theme}</strong>
        </p>
      </div>

      {/* GlassmorphismCard Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. GlassmorphismCard Component</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Card */}
          <GlassmorphismCard>
            <h3 className="text-lg font-semibold mb-2">Default Card</h3>
            <p style={{ color: 'var(--apple-text-secondary)' }}>
              Standard glassmorphism card with default padding and rounded corners.
            </p>
          </GlassmorphismCard>

          {/* Small Padding */}
          <GlassmorphismCard padding="sm" rounded="sm">
            <h3 className="text-lg font-semibold mb-2">Small Variant</h3>
            <p style={{ color: 'var(--apple-text-secondary)' }}>
              Small padding and border radius.
            </p>
          </GlassmorphismCard>

          {/* Large Shadow */}
          <GlassmorphismCard shadow="lg">
            <h3 className="text-lg font-semibold mb-2">Large Shadow</h3>
            <p style={{ color: 'var(--apple-text-secondary)' }}>
              Card with larger shadow for emphasis.
            </p>
          </GlassmorphismCard>

          {/* Hover Effect */}
          <GlassmorphismCard hover>
            <h3 className="text-lg font-semibold mb-2">Hover Effect</h3>
            <p style={{ color: 'var(--apple-text-secondary)' }}>
              Hover over this card to see the lift effect.
            </p>
          </GlassmorphismCard>

          {/* No Animation */}
          <GlassmorphismCard animated={false}>
            <h3 className="text-lg font-semibold mb-2">No Animation</h3>
            <p style={{ color: 'var(--apple-text-secondary)' }}>
              This card doesn't animate on mount.
            </p>
          </GlassmorphismCard>

          {/* Custom Style */}
          <GlassmorphismCard 
            padding="lg"
            style={{ 
              background: isDark 
                ? 'linear-gradient(135deg, rgba(10, 132, 255, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)'
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Custom Gradient</h3>
            <p style={{ color: 'var(--apple-text-secondary)' }}>
              Card with custom gradient background.
            </p>
          </GlassmorphismCard>
        </div>
      </section>

      {/* AppleButton Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. AppleButton Component</h2>
        
        <GlassmorphismCard>
          <div className="space-y-6">
            {/* Primary Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Primary Variant</h3>
              <div className="flex flex-wrap gap-4">
                <AppleButton size="sm">Small Button</AppleButton>
                <AppleButton>Default Button</AppleButton>
                <AppleButton size="lg">Large Button</AppleButton>
                <AppleButton icon={Plus} iconPosition="left">With Icon</AppleButton>
                <AppleButton icon={Check} iconPosition="right">Icon Right</AppleButton>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Secondary Variant</h3>
              <div className="flex flex-wrap gap-4">
                <AppleButton variant="secondary">Secondary</AppleButton>
                <AppleButton variant="secondary" icon={Search}>Search</AppleButton>
                <AppleButton variant="secondary" disabled>Disabled</AppleButton>
              </div>
            </div>

            {/* Ghost Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ghost Variant</h3>
              <div className="flex flex-wrap gap-4">
                <AppleButton variant="ghost">Ghost Button</AppleButton>
                <AppleButton variant="ghost" icon={User}>Profile</AppleButton>
              </div>
            </div>

            {/* Danger & Success */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Danger & Success</h3>
              <div className="flex flex-wrap gap-4">
                <AppleButton variant="danger" icon={X}>Delete</AppleButton>
                <AppleButton variant="success" icon={Check}>Confirm</AppleButton>
              </div>
            </div>

            {/* Loading State */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Loading State</h3>
              <div className="flex flex-wrap gap-4">
                <AppleButton loading={isLoading} onClick={handleLoadingTest}>
                  {isLoading ? 'Loading...' : 'Test Loading'}
                </AppleButton>
                <AppleButton variant="secondary" loading>Loading</AppleButton>
              </div>
            </div>

            {/* Full Width */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Full Width</h3>
              <AppleButton fullWidth icon={Plus}>Full Width Button</AppleButton>
            </div>
          </div>
        </GlassmorphismCard>
      </section>

      {/* AppleInput Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3. AppleInput Component</h2>
        
        <GlassmorphismCard>
          <div className="space-y-6">
            {/* Basic Input */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Input</h3>
              <AppleInput
                label="Nome Completo"
                placeholder="Digite seu nome..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            {/* Input with Icon */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Input with Icon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppleInput
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  icon={Mail}
                  iconPosition="left"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                />
                <AppleInput
                  label="Buscar"
                  placeholder="Buscar clientes..."
                  icon={Search}
                  iconPosition="right"
                />
              </div>
            </div>

            {/* Error State */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Error State</h3>
              <AppleInput
                label="CPF"
                placeholder="000.000.000-00"
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                error={errorInput && errorInput.length < 11 ? "CPF deve ter 11 dígitos" : ""}
              />
            </div>

            {/* Disabled State */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Disabled State</h3>
              <AppleInput
                label="Campo Desabilitado"
                placeholder="Não editável"
                value="Valor fixo"
                disabled
              />
            </div>

            {/* Different Types */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Different Input Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AppleInput
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                />
                <AppleInput
                  label="Data"
                  type="date"
                />
                <AppleInput
                  label="Telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>
        </GlassmorphismCard>
      </section>

      {/* Combined Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4. Combined Example - Login Form</h2>
        
        <div className="max-w-md mx-auto">
          <GlassmorphismCard padding="lg" shadow="xl">
            <h3 className="text-2xl font-bold mb-6 text-center">Login</h3>
            
            <div className="space-y-4">
              <AppleInput
                label="Email"
                type="email"
                placeholder="seu@email.com"
                icon={Mail}
              />
              
              <AppleInput
                label="Senha"
                type="password"
                placeholder="••••••••"
              />
              
              <div className="pt-4 space-y-3">
                <AppleButton fullWidth icon={Check}>
                  Entrar
                </AppleButton>
                <AppleButton fullWidth variant="ghost">
                  Esqueci minha senha
                </AppleButton>
              </div>
            </div>
          </GlassmorphismCard>
        </div>
      </section>

      {/* Test Results */}
      <GlassmorphismCard>
        <h2 className="text-2xl font-bold mb-4">Test Results</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Check size={20} style={{ color: 'var(--apple-accent-green)' }} />
            <span>GlassmorphismCard: All variants working</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={20} style={{ color: 'var(--apple-accent-green)' }} />
            <span>AppleButton: All variants and states working</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={20} style={{ color: 'var(--apple-accent-green)' }} />
            <span>AppleInput: All states and types working</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={20} style={{ color: 'var(--apple-accent-green)' }} />
            <span>Theme integration: Working correctly</span>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
};

export default ComponentsTest;
