/**
 * Jest Configuration
 * Configuração de testes para o TORQ AI
 */

module.exports = {
  // Ambiente de teste
  testEnvironment: 'jsdom',

  // Diretórios de teste
  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // Padrões de arquivos de teste
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],

  // Transformações
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }]
  },

  // Módulos a serem ignorados
  transformIgnorePatterns: [
    'node_modules/(?!(firebase|@firebase)/)'
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],

  // Thresholds de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Diretório de cobertura
  coverageDirectory: 'coverage',

  // Reporters de cobertura
  coverageReporters: ['text', 'lcov', 'html'],

  // Module name mapper para imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Timeout global
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Limpar mocks automaticamente
  clearMocks: true,

  // Restaurar mocks automaticamente
  restoreMocks: true,

  // Resetar mocks automaticamente
  resetMocks: true
};
