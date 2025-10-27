import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Calendar, Award, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import TeamMemberForm from '../components/forms/TeamMemberForm';
import { useTeamStore } from '../store';

const TeamPage = () => {
  const { members, schedules, fetchMembers, fetchSchedules, createMember, updateMember, deleteMember, getTeamStatistics, isLoading } = useTeamStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchMembers();
    fetchSchedules();
  }, [fetchMembers, fetchSchedules]);

  const handleCreateMember = async (memberData) => {
    const result = await createMember(memberData);
    if (result.success) {
      toast.success('Membro cadastrado com sucesso!');
      setIsModalOpen(false);
    } else {
      toast.error(result.error || 'Erro ao cadastrar membro');
    }
  };

  const handleUpdateMember = async (memberData) => {
    const result = await updateMember(editingMember.firestoreId, memberData);
    if (result.success) {
      toast.success('Membro atualizado com sucesso!');
      setIsModalOpen(false);
      setEditingMember(null);
    } else {
      toast.error(result.error || 'Erro ao atualizar membro');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Tem certeza que deseja excluir este membro?')) {
      const result = await deleteMember(memberId);
      if (result.success) {
        toast.success('Membro excluído com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao excluir membro');
      }
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const stats = getTeamStatistics();

  const filteredMembers = members.filter(member => {
    if (filterRole && member.role !== filterRole) return false;
    if (filterStatus && member.status !== filterStatus) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Inativo': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'Férias': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Licença': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Afastado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const todaySchedules = schedules.filter(s => s.date === new Date().toISOString().split('T')[0] && s.status !== 'Cancelado');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestão de Equipe
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <UserPlus className="w-5 h-5" />
          Novo Membro
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total de Membros
          </h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ativos
          </h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Em Férias
          </h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Afastados
          </h3>
          <p className="text-3xl font-bold text-red-600">0</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Membros da Equipe
          </h2>
          <div className="space-y-4">
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Nenhum membro cadastrado.
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Agenda de Hoje
          </h2>
          <div className="space-y-4">
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Nenhum agendamento para hoje.
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Escalas e Horários
          </h2>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            Nova Escala
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Turno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Nenhuma escala definida.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;