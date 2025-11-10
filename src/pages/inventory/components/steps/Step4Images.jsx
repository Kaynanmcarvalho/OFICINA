import { useThemeStore } from '../../../../store/themeStore';
import { Upload, X, Star } from 'lucide-react';
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../config/firebase';
import toast from 'react-hot-toast';

const Step4Images = ({ formData, updateFormData }) => {
  const { isDarkMode } = useThemeStore();
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      }

      updateFormData({
        images: [...(formData.images || []), ...uploadedUrls]
      });
      toast.success(`${files.length} imagem(ns) enviada(s)`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Erro ao enviar imagens');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData({
      images: newImages,
      main_image_index: formData.main_image_index >= newImages.length ? 0 : formData.main_image_index
    });
  };

  const handleSetMainImage = (index) => {
    updateFormData({ main_image_index: index });
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div>
        <label className={`block text-sm font-medium mb-4 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Imagens do Produto
        </label>

        <label className={`
          flex flex-col items-center justify-center w-full h-48
          border-2 border-dashed rounded-2xl cursor-pointer
          transition-all
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDarkMode
            ? 'border-gray-700 hover:border-blue-500 bg-gray-800/50'
            : 'border-gray-300 hover:border-blue-500 bg-gray-50'
          }
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className={`w-12 h-12 mb-3 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <p className={`mb-2 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span className="font-semibold">Clique para enviar</span> ou arraste e solte
            </p>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              PNG, JPG ou WEBP (MAX. 5MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Images Grid */}
      {formData.images && formData.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((url, index) => (
            <div
              key={index}
              className={`
                relative group rounded-xl overflow-hidden
                ${formData.main_image_index === index
                  ? isDarkMode
                    ? 'ring-4 ring-blue-500'
                    : 'ring-4 ring-blue-500'
                  : ''
                }
              `}
            >
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-40 object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleSetMainImage(index)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${formData.main_image_index === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                    }
                  `}
                  title="Definir como principal"
                >
                  <Star className="w-4 h-4" fill={formData.main_image_index === index ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  title="Remover"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Badge */}
              {formData.main_image_index === index && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Step4Images;
