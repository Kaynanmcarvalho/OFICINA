import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiPackage, FiX } from 'react-icons/fi';
import { clsx } from 'clsx';

/**
 * Componente de tooltip para exibir informações do produto com imagem lazy
 * @param {Object} product - Dados do produto
 * @param {boolean} isVisible - Se o tooltip deve ser visível
 * @param {Object} position - Posição do tooltip (x, y)
 * @param {boolean} isPinned - Se o tooltip está fixado por clique
 * @param {Function} onClose - Função para fechar o tooltip
 */
const ProductTooltip = ({ product, isVisible, position, isPinned = false, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  // Carregar imagem apenas quando o tooltip for visível
  useEffect(() => {
    if (isVisible && product) {
      // Reset states
      setImageLoaded(false);
      setImageError(false);
      
      // Verificar se o produto tem imagem
      if (product.imagem) {
        setImageSrc(product.imagem);
      } else {
        // Se não houver imagem, marcar como erro para mostrar placeholder
        setImageSrc(null);
        setImageError(true);
      }
    }
  }, [isVisible, product]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  if (!isVisible || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2 }}
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm"
        style={{
          left: position.x + 10,
          top: position.y - 10,
          transform: 'translateY(-100%)'
        }}
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho com código e nome */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
            #{product.codigo}
          </span>
          <h4 className="font-semibold text-gray-900 text-sm">{product.nome}</h4>
        </div>

        {/* Área da imagem */}
        <div className="mb-3">
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {imageSrc && !imageError ? (
              <img
                src={imageSrc}
                alt={product.nome}
                className={clsx(
                  'w-full h-full object-cover transition-opacity duration-300',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                {imageError ? (
                  <>
                    <FiImage size={24} className="mb-1" />
                    <span className="text-xs">Sem imagem</span>
                  </>
                ) : (
                  <>
                    <FiPackage size={24} className="mb-1" />
                    <span className="text-xs">Carregando...</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Informações do produto */}
        <div className="space-y-2">
          {product.descricao && (
            <p className="text-sm text-gray-600">{product.descricao}</p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">
              R$ {product.preco.toFixed(2)}
            </span>
            <span className={clsx(
              'text-xs px-2 py-1 rounded-full font-medium',
              product.quantidade > 10 ? 'bg-green-100 text-green-800' :
              product.quantidade > 5 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            )}>
              {product.quantidade} un.
            </span>
          </div>

          {product.categoria && (
            <div className="pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">Categoria: {product.categoria}</span>
            </div>
          )}
        </div>

        {/* Botão de fechar quando fixado */}
        {isPinned && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={14} />
          </button>
        )}

        {/* Seta do tooltip */}
        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductTooltip;