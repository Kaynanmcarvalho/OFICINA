/**
 * Logger
 * Sistema de logging estruturado
 */

class Logger {
  constructor(context = 'App') {
    this.context = context;
  }

  /**
   * Log de informação
   */
  info(message, data = {}) {
    console.log(JSON.stringify({
      level: 'INFO',
      context: this.context,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Log de aviso
   */
  warn(message, data = {}) {
    console.warn(JSON.stringify({
      level: 'WARN',
      context: this.context,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Log de erro
   */
  error(message, data = {}) {
    console.error(JSON.stringify({
      level: 'ERROR',
      context: this.context,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Log de debug
   */
  debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.log(JSON.stringify({
        level: 'DEBUG',
        context: this.context,
        message,
        data,
        timestamp: new Date().toISOString()
      }));
    }
  }
}

module.exports = Logger;
