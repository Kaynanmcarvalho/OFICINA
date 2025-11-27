/**
 * Utilitários de Performance
 * Funções para otimizar o carregamento e renderização do app
 */

/**
 * Debounce - atrasa a execução de uma função
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle - limita a frequência de execução de uma função
 */
export function throttle(fn, limit = 100) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load de imagens com Intersection Observer
 */
export function lazyLoadImage(imgElement, src) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        imgElement.src = src;
        observer.unobserve(imgElement);
      }
    });
  });
  observer.observe(imgElement);
}

/**
 * Preload de recursos críticos
 */
export function preloadResource(url, type = 'script') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = type;
  document.head.appendChild(link);
}

/**
 * Memoização simples para funções puras
 */
export function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Request Idle Callback polyfill
 */
export const requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  };

/**
 * Executa tarefas em idle time
 */
export function runWhenIdle(tasks) {
  const taskQueue = [...tasks];
  
  function processTask(deadline) {
    while (taskQueue.length > 0 && deadline.timeRemaining() > 0) {
      const task = taskQueue.shift();
      task();
    }
    
    if (taskQueue.length > 0) {
      requestIdleCallback(processTask);
    }
  }
  
  requestIdleCallback(processTask);
}

/**
 * Batch DOM updates
 */
export function batchDOMUpdates(updates) {
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
}

/**
 * Verifica se o dispositivo é de baixa performance
 */
export function isLowEndDevice() {
  // Verifica memória disponível (se suportado)
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    return true;
  }
  
  // Verifica número de cores
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    return true;
  }
  
  // Verifica conexão lenta
  if (navigator.connection) {
    const { effectiveType, saveData } = navigator.connection;
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      return true;
    }
  }
  
  return false;
}

/**
 * Prefetch de páginas
 */
export function prefetchPage(url) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

export default {
  debounce,
  throttle,
  lazyLoadImage,
  preloadResource,
  memoize,
  requestIdleCallback,
  runWhenIdle,
  batchDOMUpdates,
  isLowEndDevice,
  prefetchPage,
};
