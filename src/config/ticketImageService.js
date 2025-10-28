// Serviço para upload de imagens dos tickets
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

class TicketImageService {
  constructor() {
    this.basePath = 'tickets';
  }

  // Upload de imagem para o Firebase Storage
  async uploadImage(file, ticketId, imageIndex) {
    try {
      // Validar arquivo
      if (!file || !file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Imagem deve ter no máximo 5MB');
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileName = `${ticketId}_${imageIndex}_${timestamp}.${extension}`;
      
      // Criar referência no Storage
      const imageRef = ref(storage, `${this.basePath}/${ticketId}/${fileName}`);
      
      // Upload do arquivo
      console.log('📤 Fazendo upload da imagem:', fileName);
      const snapshot = await uploadBytes(imageRef, file);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Upload concluído:', downloadURL);
      return {
        url: downloadURL,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('❌ Erro no upload da imagem:', error);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  }

  // Upload múltiplo de imagens
  async uploadMultipleImages(files, ticketId, maxImages = 3) {
    try {
      if (!files || files.length === 0) {
        return [];
      }

      if (files.length > maxImages) {
        throw new Error(`Máximo de ${maxImages} imagens permitidas`);
      }

      const uploadPromises = Array.from(files).map((file, index) => 
        this.uploadImage(file, ticketId, index + 1)
      );

      const results = await Promise.all(uploadPromises);
      console.log('✅ Upload múltiplo concluído:', results.length, 'imagens');
      
      return results;
    } catch (error) {
      console.error('❌ Erro no upload múltiplo:', error);
      throw error;
    }
  }

  // Deletar imagem do Storage
  async deleteImage(imageUrl) {
    try {
      // Extrair o path da URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      
      if (!pathMatch) {
        throw new Error('URL de imagem inválida');
      }

      const imagePath = decodeURIComponent(pathMatch[1]);
      const imageRef = ref(storage, imagePath);
      
      await deleteObject(imageRef);
      console.log('✅ Imagem deletada:', imagePath);
    } catch (error) {
      console.error('❌ Erro ao deletar imagem:', error);
      throw new Error(`Falha ao deletar imagem: ${error.message}`);
    }
  }

  // Deletar múltiplas imagens
  async deleteMultipleImages(imageUrls) {
    try {
      if (!imageUrls || imageUrls.length === 0) {
        return;
      }

      const deletePromises = imageUrls.map(url => this.deleteImage(url));
      await Promise.all(deletePromises);
      
      console.log('✅ Múltiplas imagens deletadas:', imageUrls.length);
    } catch (error) {
      console.error('❌ Erro ao deletar múltiplas imagens:', error);
      throw error;
    }
  }

  // Validar arquivo de imagem
  validateImageFile(file) {
    const errors = [];

    if (!file) {
      errors.push('Nenhum arquivo selecionado');
      return errors;
    }

    if (!file.type.startsWith('image/')) {
      errors.push('Arquivo deve ser uma imagem');
    }

    if (file.size > 5 * 1024 * 1024) {
      errors.push('Imagem deve ter no máximo 5MB');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Formato não suportado. Use: JPEG, PNG, GIF ou WebP');
    }

    return errors;
  }

  // Redimensionar imagem (opcional, para otimização)
  async resizeImage(file, maxWidth = 1200, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para blob
        canvas.toBlob(resolve, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export default new TicketImageService();