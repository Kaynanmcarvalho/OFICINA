/**
 * Portal - Renderiza componentes diretamente no body
 * Usado para modais, tooltips e outros elementos que precisam escapar do contexto atual
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, containerId = 'modal-root' }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    // Procurar por container existente
    let modalContainer = document.getElementById(containerId);
    
    // Se não existir, criar um novo
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = containerId;
      modalContainer.style.position = 'fixed';
      modalContainer.style.top = '0';
      modalContainer.style.left = '0';
      modalContainer.style.width = '100%';
      modalContainer.style.height = '100%';
      modalContainer.style.pointerEvents = 'none';
      modalContainer.style.zIndex = '9999';
      document.body.appendChild(modalContainer);
    }
    
    setContainer(modalContainer);
    
    // Cleanup não é necessário pois o container pode ser reutilizado
  }, [containerId]);

  // Se o container não estiver pronto, não renderizar nada
  if (!container) return null;

  // Renderizar o children no container usando portal
  return createPortal(children, container);
};

export default Portal;