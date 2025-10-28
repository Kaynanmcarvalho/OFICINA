/**
 * Sistema de debug logger
 * Para ativar os logs, digite no console: /mostrar
 * Para desativar: /ocultar
 */

class DebugLogger {
  constructor() {
    this.enabled = false;
    
    // Expor comandos globalmente
    if (typeof window !== 'undefined') {
      window['/mostrar'] = () => this.enable();
      window['/ocultar'] = () => this.disable();
    }
  }

  enable() {
    this.enabled = true;
    console.log('🔍 Debug logs ATIVADOS');
    console.log('💡 Digite /ocultar para desativar');
  }

  disable() {
    this.enabled = false;
    console.log('🔇 Debug logs DESATIVADOS');
  }

  log(...args) {
    if (this.enabled) {
      console.log(...args);
    }
  }

  info(...args) {
    if (this.enabled) {
      console.info(...args);
    }
  }

  warn(...args) {
    // Warnings sempre aparecem
    console.warn(...args);
  }

  error(...args) {
    // Erros sempre aparecem
    console.error(...args);
  }

  debug(...args) {
    if (this.enabled) {
      console.debug(...args);
    }
  }

  table(...args) {
    if (this.enabled) {
      console.table(...args);
    }
  }
}

// Exportar instância singleton
const debugLogger = new DebugLogger();
export default debugLogger;
