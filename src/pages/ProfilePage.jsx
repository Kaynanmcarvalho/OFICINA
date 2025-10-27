import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore, useOrganizationStore } from '../store/index.jsx';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { MdBusiness, MdLocationOn, MdPhone, MdEmail, MdSchedule, MdEdit, MdSave, MdCancel, MdCamera } from 'react-icons/md';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { organization, fetchOrganization, getOrganizationInfo } = useOrganizationStore();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    position: '',
    bio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.position || '',
        bio: user.bio || '',
      });
      setPhotoURL(user.photoURL || '');

      // Fetch organization data
      if (user.organizationId) {
        fetchOrganization(user.organizationId);
      }
    }
  }, [user, fetchOrganization]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      // Upload para Firebase Storage
      const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Atualizar Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      });

      setPhotoURL(downloadURL);
      toast.success('Foto atualizada com sucesso!');

      // Recarregar dados do usuário
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Erro ao fazer upload da foto');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');

      // Reload user data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const organizationInfo = getOrganizationInfo();

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Perfil do Usuário
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4 overflow-hidden group">
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl text-blue-600 dark:text-blue-400">{user.displayName?.[0] || 'U'}</span>
                )}

                {/* Upload overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}>
                  {isUploadingPhoto ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : (
                    <MdCamera className="w-8 h-8 text-white" />
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.displayName}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.position || 'Cargo não definido'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Clique na foto para alterar
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center mb-3">
                <span className="w-8 text-gray-500 dark:text-gray-400">📧</span>
                <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
              </div>
              <div className="flex items-center mb-3">
                <span className="w-8 text-gray-500 dark:text-gray-400">📱</span>
                <span className="text-gray-700 dark:text-gray-300">{user.phone || 'Não informado'}</span>
              </div>
              <div className="flex items-center mb-3">
                <span className="w-8 text-gray-500 dark:text-gray-400">🏢</span>
                <span className="text-gray-700 dark:text-gray-300">{organizationInfo.name}</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 text-gray-500 dark:text-gray-400">🔑</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {user.role === 'admin' ? 'Administrador' : user.role === 'func' ? 'Funcionário' : user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Organization Info */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <MdBusiness className="mr-2" />
              Informações da Empresa
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <MdLocationOn className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{organizationInfo.address}</span>
              </div>
              <div className="flex items-center">
                <MdPhone className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{organizationInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <MdEmail className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{organizationInfo.email}</span>
              </div>
              <div className="flex items-center">
                <MdSchedule className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{organizationInfo.businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Informações Pessoais
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <MdEdit className="mr-1" />
                  Editar
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <MdCancel className="mr-1" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cargo/Posição
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biografia
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>

              {isEditing && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MdSave className="mr-2" />
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              )}
            </form>
          </div>

          {/* Document Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Informações do Documento
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Pessoa
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.personType === 'juridica' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {user.personType === 'juridica' ? 'CNPJ' : 'CPF'}
                </label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {user.cpfCnpj || user.cnpj || user.cpf || 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;