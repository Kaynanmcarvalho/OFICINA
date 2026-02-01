/**
 * Storage Service
 * Gerencia upload de fotos no Firebase Storage
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Faz upload de foto do check-in
 * @param {File} file - Arquivo da foto
 * @param {string} placa - Placa do veículo
 * @param {string} empresaId - ID da empresa
 * @param {string} tipo - Tipo: 'entrada' ou 'saida'
 * @returns {Promise<string>} URL da foto
 */
export const uploadCheckinPhoto = async (file, placa, empresaId, tipo = 'entrada') => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    
    const path = `checkins/${empresaId}/${placa}/${timestamp}/${tipo}/${fileName}`;
    const storageRef = ref(storage, path);
    
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return url;
  } catch (error) {
    console.error('Erro ao enviar foto:', error);
    throw error;
  }
};

/**
 * Aplica overlay de cor e logo na foto
 * @param {File} file - Arquivo original
 * @param {string} cor - Cor em hexadecimal
 * @param {string} marca - Marca do veículo
 * @returns {Promise<File>} Arquivo com overlay
 */
export const applyOverlay = async (file, cor, marca) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        
        // Desenha imagem original
        ctx.drawImage(img, 0, 0);
        
        // Aplica overlay de cor (12% de opacidade)
        if (cor) {
          ctx.fillStyle = cor + '1F'; // 1F = ~12% opacity
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Adiciona marca no canto inferior direito
        if (marca) {
          const fontSize = Math.max(24, canvas.width / 30);
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          
          const text = marca.toUpperCase();
          const textWidth = ctx.measureText(text).width;
          const x = canvas.width - textWidth - 20;
          const y = canvas.height - 20;
          
          // Sombra
          ctx.strokeText(text, x, y);
          ctx.fillText(text, x, y);
        }
        
        // Converte canvas para blob
        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name, { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(newFile);
          } else {
            reject(new Error('Erro ao criar blob'));
          }
        }, 'image/jpeg', 0.92);
      };
      
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Redimensiona imagem se necessário
 * @param {File} file - Arquivo original
 * @param {number} maxWidth - Largura máxima
 * @param {number} maxHeight - Altura máxima
 * @returns {Promise<File>} Arquivo redimensionado
 */
export const resizeImage = async (file, maxWidth = 1920, maxHeight = 1080) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Calcula novas dimensões mantendo proporção
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name, { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(newFile);
          } else {
            reject(new Error('Erro ao criar blob'));
          }
        }, 'image/jpeg', 0.92);
      };
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });
};

export default {
  uploadCheckinPhoto,
  applyOverlay,
  resizeImage
};
