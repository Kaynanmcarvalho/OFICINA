import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Calendar, Award, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import TeamMemberForm from '../components/forms/TeamMemberForm';
import ScheduleForm from '../components/forms/ScheduleForm';
import { useTeamStore } from '../store';

const TeamPage = () => {
  const {
    members,
    schedules,
    fetchMembers,
    fetchSchedules,
    createMember,
    updateMember,
    deleteMember,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getTeamStatistics,
    isLoading
  } = useTeamStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
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

  const handleCreateSchedule = async (scheduleData) => {
    const result = await createSchedule(scheduleData);
    if (result.success) {
      toast.success('Escala criada com sucesso!');
      setIsScheduleModalOpen(false);
    } else {
      toast.error(result.error || 'Erro ao criar escala');
    }
  };

  const handleUpdateSchedule = async (scheduleData) => {
    const result = await updateSchedule(editingSchedule.firestoreId, scheduleData);
    if (result.success) {
      toast.success('Escala atualizada com sucesso!');
      setIsScheduleModalOpen(false);
      setEditingSchedule(null);
    } else {
      toast.error(result.error || 'Erro ao atualizar escala');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Tem certeza que deseja excluir esta escala?')) {
      const result = await deleteSchedule(scheduleId);
      if (result.success) {
        toast.success('Escala excluída com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao excluir escala');
      }
    }
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setIsScheduleModalOpen(true);
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
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total de Membros</h3>
            <Users className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.totalMembers}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Ativos</h3>
            <Award className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.activeMembers}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Em Férias</h3>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.onVacation}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Afastados</h3>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.onLeave}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Membros da Equipe
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                Carregando...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhum membro cadastrado.
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div key={member.firestoreId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.firestoreId)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Agenda de Hoje
          </h2>
          <div className="space-y-4">
            {todaySchedules.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhum agendamento para hoje.
              </div>
            ) : (
              todaySchedules.map((schedule) => (
                <div key={schedule.firestoreId} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {members.find(m => m.firestoreId === schedule.memberId)?.name || 'Desconhecido'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {schedule.shift} - {schedule.startTime} às {schedule.endTime}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${schedule.status === 'Confirmado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      schedule.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Escalas e Horários
          </h2>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
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
                  Data
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
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma escala definida.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => {
                  const member = members.find(m => m.firestoreId === schedule.memberId);
                  return (
                    <tr key={schedule.firestoreId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {member?.name || 'Desconhecido'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {member?.role || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(schedule.date).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {schedule.shift}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${schedule.status === 'Confirmado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          schedule.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            schedule.status === 'Cancelado' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                          {schedule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditSchedule(schedule)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.firestoreId)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setEditingSchedule(null);
        }}
        title={editingSchedule ? 'Editar Escala' : 'Nova Escala'}
        size="lg"
      >
        <ScheduleForm
          schedule={editingSchedule}
          members={members}
          onSubmit={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setEditingSchedule(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default TeamPage;