import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import ScheduleForm from '../components/forms/ScheduleForm';
import { useTeamStore } from '../store';

const SchedulePage = () => {
  const { schedules, members, fetchSchedules, fetchMembers, createSchedule, updateSchedule, deleteSchedule, isLoading } = useTeamStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('day'); // day, week, month
  const [filterShift, setFilterShift] = useState('');

  useEffect(() => {
    fetchSchedules();
    fetchMembers();
  }, [fetchSchedules, fetchMembers]);

  const handleCreateSchedule = async (scheduleData) => {
    const result = await createSchedule(scheduleData);
    if (result.success) {
      toast.success('Agendamento criado com sucesso!');
      setIsModalOpen(false);
    } else {
      toast.error(result.error || 'Erro ao criar agendamento');
    }
  };

  const handleUpdateSchedule = async (scheduleData) => {
    const result = await updateSchedule(editingSchedule.firestoreId, scheduleData);
    if (result.success) {
      toast.success('Agendamento atualizado com sucesso!');
      setIsModalOpen(false);
      setEditingSchedule(null);
    } else {
      toast.error(result.error || 'Erro ao atualizar agendamento');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      const result = await deleteSchedule(scheduleId);
      if (result.success) {
        toast.success('Agendamento excluído com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao excluir agendamento');
      }
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  const todaySchedules = schedules.filter(s => s.date === selectedDate && s.status !== 'Cancelado');
  const filteredSchedules = filterShift 
    ? todaySchedules.filter(s => s.shift === filterShift)
    : todaySchedules;

  const getScheduleStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayCount = schedules.filter(s => s.date === today && s.status !== 'Cancelado').length;
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekCount = schedules.filter(s => {
      const scheduleDate = new Date(s.date);
      return scheduleDate >= weekStart && scheduleDate <= weekEnd && s.status !== 'Cancelado';
    }).length;

    const monthStart = new Date();
    monthStart.setDate(1);
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0);

    const monthCount = schedules.filter(s => {
      const scheduleDate = new Date(s.date);
      return scheduleDate >= monthStart && scheduleDate <= monthEnd && s.status !== 'Cancelado';
    }).length;

    return { todayCount, weekCount, monthCount };
  };

  const stats = getScheduleStats();

  const getMemberName = (memberId) => {
    const member = members.find(m => m.firestoreId === memberId);
    return member ? member.name : 'N/A';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Agenda e Cronograma
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie horários, agendamentos e cronogramas da oficina
        </p>
      </div>

      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Agendamentos Hoje
            </h3>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.todayCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Data: {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Esta Semana
            </h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.weekCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Agendamentos confirmados</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Este Mês
            </h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.monthCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total de agendamentos</p>
        </div>
      </div>

      {/* Date Selector and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todos os turnos</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
              <option value="Integral">Integral</option>
            </select>
          </div>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Hoje
          </button>
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Agendamentos - {new Date(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h2>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Carregando agendamentos...
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum agendamento para esta data</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSchedules.map((schedule) => (
              <div key={schedule.firestoreId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(schedule.priority)}`}>
                      {schedule.priority === 'urgent' ? 'Urgente' : 
                       schedule.priority === 'high' ? 'Alta' :
                       schedule.priority === 'low' ? 'Baixa' : 'Normal'}
                    </span>
                    {schedule.shift && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                        {schedule.shift}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {schedule.serviceType} - {getMemberName(schedule.memberId)}
                  </p>
                  {schedule.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {schedule.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(schedule)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.firestoreId)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
        size="lg"
      >
        <ScheduleForm
          onSubmit={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}
          onClose={handleCloseModal}
          initialData={editingSchedule}
        />
      </Modal>
    </div>
  );
};

export default SchedulePage;