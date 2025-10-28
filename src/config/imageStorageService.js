/**
 * Serviço para gerenciar upload e download de imagens no Firebase Storage
 * Substitui o uso de base64 por URLs do Firebase Storage
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

class ImageStorageService {
  constructor() {
    this.basePath = 'produtos'; // Pasta base para imagens de produtos
    this.logoPath = 'empresa'; // Pasta para logos da empresa
  }

  /**
   * Faz upload do logo da empresa para o Firebase Storage
   * @param {File} file - Arquivo de imagem do logo
   * @returns {Promise<string>} URL do logo no Firebase Storage
   */
  async uploadCompanyLogo(file) {
    try {
      if (!file) {
        throw new Error('Arquivo não fornecido');
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }

      // Validar tamanho (máximo 2MB para logo)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        throw new Error('Logo deve ter no máximo 2MB');
      }

      // Nome fixo para o logo da empresa
      const extension = file.name.split('.').pop();
      const fileName = `logo-empresa.${extension}`;

      // Criar referência no Storage
      const logoRef = ref(storage, `${this.logoPath}/${fileName}`);

      // Fazer upload
      console.log('📤 Fazendo upload do logo da empresa:', fileName);
      const snapshot = await uploadBytes(logoRef, file);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('✅ Logo da empresa enviado com sucesso:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('❌ Erro ao fazer upload do logo:', error);
      throw error;
    }
  }

  /**
   * Faz upload de uma imagem para o Firebase Storage
   * @param {File} file - Arquivo de imagem
   * @param {string} productId - ID do produto (opcional, para organização)
   * @returns {Promise<string>} URL da imagem no Firebase Storage
   */
  async uploadProductImage(file, productId = null) {
    try {
      if (!file) {
        throw new Error('Arquivo não fornecido');
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }

      // Validar tamanho (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Imagem deve ter no máximo 5MB');
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileName = productId 
        ? `${productId}_${timestamp}.${extension}`
        : `produto_${timestamp}.${extension}`;

      // Criar referência no Storage
      const imageRef = ref(storage, `${this.basePath}/${fileName}`);

      // Fazer upload
      console.log('📤 Fazendo upload da imagem:', fileName);
      const snapshot = await uploadBytes(imageRef, file);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Upload concluído:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ Erro no upload da imagem:', error);
      throw new Error(`Erro no upload: ${error.message}`);
    }
  }

  /**
   * Deleta uma imagem do Firebase Storage
   * @param {string} imageUrl - URL da imagem no Firebase Storage
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async deleteProductImage(imageUrl) {
    try {
      if (!imageUrl || !imageUrl.includes('firebase')) {
        console.log('URL não é do Firebase Storage, ignorando exclusão');
        return true;
      }

      // Extrair o path da URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.*?)\?/);
      
      if (!pathMatch) {
        throw new Error('Não foi possível extrair o path da URL');
      }

      const imagePath = decodeURIComponent(pathMatch[1]);
      const imageRef = ref(storage, imagePath);

      console.log('🗑️ Deletando imagem:', imagePath);
      await deleteObject(imageRef);
      
      console.log('✅ Imagem deletada com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar imagem:', error);
      // Não falhar se a imagem não existir
      if (error.code === 'storage/object-not-found') {
        console.log('Imagem já foi deletada ou não existe');
        return true;
      }
      throw new Error(`Erro ao deletar imagem: ${error.message}`);
    }
  }

  /**
   * Redimensiona uma imagem antes do upload (opcional)
   * @param {File} file - Arquivo de imagem
   * @param {number} maxWidth - Largura máxima
   * @param {number} maxHeight - Altura máxima
   * @param {number} quality - Qualidade (0-1)
   * @returns {Promise<File>} Arquivo redimensionado
   */
  async resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Configurar canvas
        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Erro ao redimensionar imagem'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Faz upload com redimensionamento automático
   * @param {File} file - Arquivo de imagem
   * @param {string} productId - ID do produto
   * @param {Object} options - Opções de redimensionamento
   * @returns {Promise<string>} URL da imagem
   */
  async uploadWithResize(file, productId = null, options = {}) {
    try {
      const {
        maxWidth = 800,
        maxHeight = 600,
        quality = 0.8,
        autoResize = true
      } = options;

      let fileToUpload = file;

      // Redimensionar se necessário
      if (autoResize && (file.size > 1024 * 1024 || file.width > maxWidth || file.height > maxHeight)) {
        console.log('🔄 Redimensionando imagem...');
        fileToUpload = await this.resizeImage(file, maxWidth, maxHeight, quality);
        console.log(`📏 Imagem redimensionada: ${file.size} → ${fileToUpload.size} bytes`);
      }

      return await this.uploadProductImage(fileToUpload, productId);
    } catch (error) {
      console.error('❌ Erro no upload com redimensionamento:', error);
      throw error;
    }
  }

  /**
   * Valida se uma URL é do Firebase Storage
   * @param {string} url - URL para validar
   * @returns {boolean} Se é URL do Firebase Storage
   */
  isFirebaseStorageUrl(url) {
    return url && (url.includes('firebasestorage.googleapis.com') || url.includes('firebase'));
  }

  /**
   * Converte base64 para File object
   * @param {string} base64 - String base64
   * @param {string} filename - Nome do arquivo
   * @returns {File} Objeto File
   */
  base64ToFile(base64, filename = 'image.jpg') {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }
}

// Exportar instância singleton
const imageStorageService = new ImageStorageService();
export default imageStorageService;