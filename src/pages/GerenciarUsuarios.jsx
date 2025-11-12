/**
 * GerenciarUsuarios - Gerenciamento de Usuários da Empresa
 * 
 * Admin da empresa pode criar usuários que ficam automaticamente
 * vinculados à empresa dele (empresaId automático)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Edit, Trash2, Shield, Mail, Phone } from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { useEmpresa } from '../contexts/EmpresaContext';
import { formatPhone } from '../utils/formatters';
import toast from 'react-hot-toast';

const GerenciarUsuarios = () => {
  const empresaData = useEmpresa();
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cargo: '',
    role: 'atendente'
  });

  useEffect(() => {
    if (empresaData?.empresaId) {
      loadUsuarios();
    }
  }, [empresaData]);

  const loadUsuarios = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(
        collection(db, `empresas/${empresaData.empresaId}/usuarios`)
      );

      const usuariosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUsuario = async (e) => {
    e.preventDefault();

    if (novoUsuario.senha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        novoUsuario.email,
        novoUsuario.senha
      );

      const userId = userCredential.user.uid;

      // 2. Criar documento em /usuarios (global) com empresaId automático
      await setDoc(doc(db, 'usuarios', userId), {
        empresaId: empresaData.empresaId, // AUTOMÁTICO
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        telefone: novoUsuario.telefone,
        cargo: novoUsuario.cargo,
        role: novoUsuario.role,
        ativo: true,
        permissoes: novoUsuario.role === 'admin' ? ['all'] : [],
        dataCriacao: serverTimestamp()
      });

      // 3. Criar documento em /empresas/{empresaId}/usuarios
      await setDoc(doc(db, `empresas/${empresaData.empresaId}/usuarios`, userId), {
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        telefone: novoUsuario.telefone,
        cargo: novoUsuario.cargo,
        role: novoUsuario.role,
        ativo: true,
        permissoes: novoUsuario.role === 'admin' ? ['all'] : [],
        dataCriacao: serverTimestamp()
      });

      toast.success('Usuário criado com sucesso!', {
        icon: '✅',
        duration: 3000
      });

      // Resetar form e recarregar lista
      setNovoUsuario({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
        cargo: '',
        role: 'atendente'
      });
      setIsModalOpen(false);
      loadUsuarios();

    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      
      let errorMessage = 'Erro ao criar usuário';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }

      toast.error(errorMessage, {
        icon: '❌',
        duration: 4000
      });
    }
  };

  const handleDeleteUsuario = async (userId) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await deleteDoc(doc(db, `empresas/${empresaData.empresaId}/usuarios`, userId));
      
      toast.success('Usuário excluído com sucesso');
      loadUsuarios();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  if (!empresaData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gerenciar Usuários
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {empresaData.nomeFantasia} - {usuarios.length} usuários
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      {/* Lista de Usuários */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando usuários...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario) => (
            <UsuarioCard
              key={usuario.id}
              usuario={usuario}
              onDelete={handleDeleteUsuario}
            />
          ))}
        </div>
      )}

      {/* Modal Novo Usuário */}
      {isModalOpen && (
        <ModalNovoUsuario
          novoUsuario={novoUsuario}
          setNovoUsuario={setNovoUsuario}
          onSubmit={handleCreateUsuario}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

// Card de Usuário
const UsuarioCard = ({ usuario, onDelete }) => {
  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: 'Admin' },
      atendente: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', label: 'Atendente' },
      financeiro: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', label: 'Financeiro' }
    };

    return badges[role] || badges.atendente;
  };

  const badge = getRoleBadge(usuario.role);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {usuario.nome}
      </h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Mail className="w-4 h-4" />
          {usuario.email}
        </div>
        {usuario.telefone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            {formatPhone(usuario.telefone)}
          </div>
        )}
        {usuario.cargo && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="w-4 h-4" />
            {usuario.cargo}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onDelete(usuario.id)}
          className="flex-1 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Excluir
        </button>
      </div>
    </motion.div>
  );
};

// Modal Novo Usuário
const ModalNovoUsuario = ({ novoUsuario, setNovoUsuario, onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Novo Usuário
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            O usuário será automaticamente vinculado à sua empresa
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={novoUsuario.nome}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="João Silva"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={novoUsuario.email}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="joao@empresa.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Senha *
              </label>
              <input
                type="password"
                value={novoUsuario.senha}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  value={novoUsuario.telefone}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, telefone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Cargo
                </label>
                <input
                  type="text"
                  value={novoUsuario.cargo}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, cargo: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Atendente"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nível de Acesso *
              </label>
              <select
                value={novoUsuario.role}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, role: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="atendente">Atendente - Criar clientes, orçamentos e check-ins</option>
                <option value="financeiro">Financeiro - Acessar caixa e relatórios</option>
                <option value="admin">Admin - Acesso total</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              Criar Usuário
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default GerenciarUsuarios;
