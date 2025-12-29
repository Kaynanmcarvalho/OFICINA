import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  CalendarDays,
  AlertCircle,
  Timer,
  Search,
  X,
  Wrench,
  User,
  Car,
  CheckCircle,
  Play,
  CalendarPlus
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, differenceInHours, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTeamStore, useThemeStore, useCheckinStore } from '../store/index.jsx';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import ScheduleForm from '../components/forms/ScheduleForm';

const SchedulePage = () => {
  const { isDarkMode } = useThemeStore();
  const { 
    schedules, 
    members, 
    isLoading, 
    fetchSchedules, 
    fetchMembers, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule 
  } = useTeamStore();
  
  const { checkins, fetchCheckins } = useCheckinStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [prefillFromCheckin, setPrefillFromCheckin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('schedules'); // 'schedules' | 'checkins'

  // Função para obter data atual em São Paulo
  const getTodayInSaoPaulo = () => {
    const now = new Date();
    const saoPauloOffset = -3 * 60;
    const localOffset = now.getTimezoneOffset();
    const diff = localOffset - saoPauloOffset;
    return new Date(now.getTime() - diff * 60 * 1000);
  };

  const [selectedDate, setSelectedDate] = useState(getTodayInSaoPaulo());
  const [currentMonth, setCurrentMonth] = useState(getTodayInSaoPaulo());
  const [filterShift, setFilterShift] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    fetchSchedules();
    fetchMembers();
    fetchCheckins();
  }, [fetchSchedules, fetchMembers, fetchCheckins]);

  // Função auxiliar para converter data para string yyyy-MM-dd
  const getDateString = (dateValue) => {
    if (!dateValue) return null;
    // Se for string, pegar só a parte da data
    if (typeof dateValue === 'string') return dateValue.split('T')[0];
    // Se for Timestamp do Firebase
    if (dateValue?.toDate) return format(dateValue.toDate(), 'yyyy-MM-dd');
    // Se for Date
    if (dateValue instanceof Date) return format(dateValue, 'yyyy-MM-dd');
    // Se for objeto com seconds (Timestamp)
    if (dateValue?.seconds) return format(new Date(dateValue.seconds * 1000), 'yyyy-MM-dd');
    return null;
  };

  // Dados de Check-ins
  const checkinStats = useMemo(() => {
    const today = format(getTodayInSaoPaulo(), 'yyyy-MM-dd');
    
    // Check-ins em andamento
    const inProgress = checkins.filter(c => c.status === 'in-progress');
    
    // Iniciados hoje
    const startedToday = checkins.filter(c => {
      const checkinDate = getDateString(c.checkinDate) || getDateString(c.createdAt);
      return checkinDate === today && c.status === 'in-progress';
    });
    
    // Com previsão de entrega para hoje
    const deliveryToday = checkins.filter(c => {
      const deliveryDate = getDateString(c.expectedDelivery) || getDateString(c.estimatedDelivery);
      return deliveryDate === today && c.status === 'in-progress';
    });
    
    // Atrasados (previsão passou)
    const overdue = checkins.filter(c => {
      if (c.status !== 'in-progress') return false;
      const deliveryDateStr = getDateString(c.expectedDelivery) || getDateString(c.estimatedDelivery);
      if (!deliveryDateStr) return false;
      return new Date(deliveryDateStr) < getTodayInSaoPaulo();
    });

    return {
      inProgress: inProgress.length,
      startedToday: startedToday.length,
      deliveryToday: deliveryToday.length,
      overdue: overdue.length,
      list: inProgress
    };
  }, [checkins]);

  // Check-ins filtrados por data selecionada
  const filteredCheckins = useMemo(() => {
    const selectedStr = format(selectedDate, 'yyyy-MM-dd');
    
    return checkins.filter(c => {
      // Mostrar se foi criado na data selecionada OU tem previsão para a data
      const checkinDate = getDateString(c.checkinDate) || getDateString(c.createdAt);
      const deliveryDate = getDateString(c.expectedDelivery) || getDateString(c.estimatedDelivery);
      
      return checkinDate === selectedStr || deliveryDate === selectedStr;
    }).sort((a, b) => {
      // Ordenar por previsão de entrega
      const dateA = getDateString(a.expectedDelivery) || getDateString(a.estimatedDelivery) || getDateString(a.createdAt);
      const dateB = getDateString(b.expectedDelivery) || getDateString(b.estimatedDelivery) || getDateString(b.createdAt);
      return new Date(dateA || 0) - new Date(dateB || 0);
    });
  }, [checkins, selectedDate]);

  // Função para calcular tempo restante
  const getTimeRemaining = (deliveryDate) => {
    if (!deliveryDate) return null;
    const now = getTodayInSaoPaulo();
    let delivery;
    
    // Converter para Date
    if (typeof deliveryDate === 'string') {
      delivery = new Date(deliveryDate);
    } else if (deliveryDate?.toDate) {
      delivery = deliveryDate.toDate();
    } else if (deliveryDate?.seconds) {
      delivery = new Date(deliveryDate.seconds * 1000);
    } else if (deliveryDate instanceof Date) {
      delivery = deliveryDate;
    } else {
      return null;
    }
    
    const hoursLeft = differenceInHours(delivery, now);
    const daysLeft = differenceInDays(delivery, now);
    
    if (hoursLeft < 0) return { text: 'Atrasado', color: 'text-red-500', bg: 'bg-red-500/10' };
    if (hoursLeft < 24) return { text: `${hoursLeft}h restantes`, color: 'text-orange-500', bg: 'bg-orange-500/10' };
    if (daysLeft === 1) return { text: 'Amanhã', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    return { text: `${daysLeft} dias`, color: 'text-green-500', bg: 'bg-green-500/10' };
  };

  // Handlers
  const handleCreateSchedule = async (scheduleData) => {
    // Se veio de um check-in, incluir o checkinId
    const dataToSave = prefillFromCheckin 
      ? { ...scheduleData, checkinId: prefillFromCheckin.checkinId }
      : scheduleData;
    
    const result = await createSchedule(dataToSave);
    if (result.success) {
      toast.success('Agendamento criado com sucesso!');
      setIsModalOpen(false);
      setPrefillFromCheckin(null);
    } else {
      toast.error(result.error || 'Erro ao criar agendamento');
    }
  };

  const handleUpdateSchedule = async (scheduleData) => {
    const result = await updateSchedule(editingSchedule.firestoreId, scheduleData);
    if (result.success) {
      toast.success('Agendamento atualizado!');
      setIsModalOpen(false);
      setEditingSchedule(null);
    } else {
      toast.error(result.error || 'Erro ao atualizar');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Excluir este agendamento?')) {
      const result = await deleteSchedule(scheduleId);
      if (result.success) {
        toast.success('Agendamento excluído!');
      } else {
        toast.error(result.error || 'Erro ao excluir');
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
    setPrefillFromCheckin(null);
  };

  // Verificar se um check-in já tem agendamento
  const hasScheduleForCheckin = useCallback((checkinId) => {
    return schedules.some(s => s.checkinId === checkinId && s.status !== 'Cancelado');
  }, [schedules]);

  // Criar agendamento a partir de um check-in
  const handleCreateFromCheckin = (checkin) => {
    const prefillData = {
      clientId: checkin.clientId || '',
      clientName: checkin.clientName || '',
      vehicleId: checkin.vehicleId || '',
      vehicleBrand: checkin.vehicleBrand || '',
      vehicleModel: checkin.vehicleModel || '',
      vehiclePlate: checkin.vehiclePlate || '',
      serviceType: checkin.serviceType || 'Manutenção',
      description: checkin.serviceDescription || checkin.complaint || '',
      checkinId: checkin.firestoreId,
      priority: 'normal'
    };
    setPrefillFromCheckin(prefillData);
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  // Filtros e dados
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  
  const filteredSchedules = useMemo(() => {
    let filtered = schedules.filter(s => s.date === selectedDateStr && s.status !== 'Cancelado');
    
    if (filterShift) {
      filtered = filtered.filter(s => s.shift === filterShift);
    }
    if (filterPriority) {
      filtered = filtered.filter(s => s.priority === filterPriority);
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.serviceType?.toLowerCase().includes(search) ||
        s.clientName?.toLowerCase().includes(search) ||
        s.description?.toLowerCase().includes(search)
      );
    }
    
    return filtered.sort((a, b) => a.startTime?.localeCompare(b.startTime));
  }, [schedules, selectedDateStr, filterShift, filterPriority, searchTerm]);

  // Gerar dias do calendário
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { locale: ptBR });
    const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Contar agendamentos por dia
  const getScheduleCountForDay = useCallback((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return schedules.filter(s => s.date === dayStr && s.status !== 'Cancelado').length;
  }, [schedules]);

  // Estatísticas
  const stats = useMemo(() => {
    const today = format(getTodayInSaoPaulo(), 'yyyy-MM-dd');
    const todayCount = schedules.filter(s => s.date === today && s.status !== 'Cancelado').length;

    const weekStart = startOfWeek(getTodayInSaoPaulo(), { locale: ptBR });
    const weekEnd = endOfWeek(getTodayInSaoPaulo(), { locale: ptBR });
    const weekCount = schedules.filter(s => {
      const d = new Date(s.date);
      return d >= weekStart && d <= weekEnd && s.status !== 'Cancelado';
    }).length;

    const monthStart = startOfMonth(getTodayInSaoPaulo());
    const monthEnd = endOfMonth(getTodayInSaoPaulo());
    const monthCount = schedules.filter(s => {
      const d = new Date(s.date);
      return d >= monthStart && d <= monthEnd && s.status !== 'Cancelado';
    }).length;

    const pendingCount = schedules.filter(s => s.status === 'Pendente').length;

    return { todayCount, weekCount, monthCount, pendingCount };
  }, [schedules]);

  const getMemberName = (memberId) => {
    const member = members.find(m => m.firestoreId === memberId);
    return member ? member.name : 'Não atribuído';
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      urgent: { 
        label: 'Urgente', 
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-500/10',
        border: 'border-red-200 dark:border-red-500/30',
        dot: 'bg-red-500'
      },
      high: { 
        label: 'Alta', 
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-50 dark:bg-orange-500/10',
        border: 'border-orange-200 dark:border-orange-500/30',
        dot: 'bg-orange-500'
      },
      normal: { 
        label: 'Normal', 
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-200 dark:border-blue-500/30',
        dot: 'bg-blue-500'
      },
      low: { 
        label: 'Baixa', 
        color: 'text-gray-600 dark:text-gray-400',
        bg: 'bg-gray-50 dark:bg-gray-500/10',
        border: 'border-gray-200 dark:border-gray-500/30',
        dot: 'bg-gray-400'
      }
    };
    return configs[priority] || configs.normal;
  };

  const getShiftConfig = (shift) => {
    const configs = {
      'Manhã': { icon: '🌅', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
      'Tarde': { icon: '☀️', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10' },
      'Noite': { icon: '🌙', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
      'Integral': { icon: '📅', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' }
    };
    return configs[shift] || { icon: '📅', color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  // Classes base para tema
  const cardClass = isDarkMode 
    ? 'bg-[#1C1E26] border border-white/[0.08]' 
    : 'bg-white border border-gray-200/80';
  
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDarkMode ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#0F1117]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-semibold ${textPrimary}`}>
              Agenda
            </h1>
            <p className={`text-sm mt-1 ${textSecondary}`}>
              Gerencie agendamentos e cronogramas da oficina
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-orange-500/25"
          >
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Agendamentos Hoje', value: stats.todayCount, icon: CalendarDays, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Em Andamento', value: checkinStats.inProgress, icon: Play, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Entregas Hoje', value: checkinStats.deliveryToday, icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Atrasados', value: checkinStats.overdue, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${cardClass} rounded-2xl p-4`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${textPrimary}`}>{stat.value}</p>
                <p className={`text-xs ${textMuted}`}>{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Calendário - Tamanho Médio */}
        <div className={`xl:col-span-3 ${cardClass} rounded-2xl overflow-hidden`}>
          {/* Header do Calendário */}
          <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-white/[0.08]' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/[0.05]' : 'hover:bg-gray-100'}`}
                >
                  <ChevronLeft className={`w-5 h-5 ${textSecondary}`} />
                </button>
                <h2 className={`text-base font-semibold ${textPrimary} min-w-[160px] text-center capitalize`}>
                  {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/[0.05]' : 'hover:bg-gray-100'}`}
                >
                  <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
                </button>
              </div>
              
              <button
                onClick={() => {
                  const today = getTodayInSaoPaulo();
                  setSelectedDate(today);
                  setCurrentMonth(today);
                }}
                className="px-3 py-1.5 text-sm font-medium text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
              >
                Hoje
              </button>
            </div>
          </div>

          {/* Grid do Calendário */}
          <div className="p-4">
            {/* Dias da Semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
                <div key={i} className={`text-center text-xs font-medium py-2 ${textMuted}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Dias do Mês */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, getTodayInSaoPaulo());
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const scheduleCount = getScheduleCountForDay(day);
                const checkinCount = checkins.filter(c => {
                  const d = getDateString(c.expectedDelivery) || getDateString(c.createdAt);
                  return d === format(day, 'yyyy-MM-dd') && c.status === 'in-progress';
                }).length;
                const hasItems = scheduleCount > 0 || checkinCount > 0;
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative h-12 rounded-xl transition-all flex flex-col items-center justify-center
                      ${isSelected 
                        ? 'bg-orange-500 text-white shadow-md' 
                        : isToday
                          ? isDarkMode ? 'bg-white/[0.08] ring-2 ring-orange-500/50' : 'bg-orange-50 ring-2 ring-orange-500/50'
                          : isDarkMode ? 'hover:bg-white/[0.05]' : 'hover:bg-gray-100'
                      }
                      ${!isCurrentMonth && 'opacity-30'}
                    `}
                  >
                    <span className={`
                      text-sm font-medium
                      ${isSelected ? 'text-white' : isToday ? 'text-orange-500' : textPrimary}
                    `}>
                      {format(day, 'd')}
                    </span>
                    
                    {hasItems && (
                      <div className="flex items-center gap-1 mt-1">
                        {scheduleCount > 0 && (
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-orange-500'}`} />
                        )}
                        {checkinCount > 0 && (
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-blue-500'}`} />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Selecionada */}
          <div className={`px-5 py-4 border-t ${isDarkMode ? 'border-white/[0.08] bg-white/[0.02]' : 'border-gray-200 bg-gray-50/50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${textMuted}`}>Data selecionada</p>
                <p className={`text-base font-medium ${textPrimary} capitalize`}>
                  {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className={`text-xl font-bold text-orange-500`}>{filteredSchedules.length}</p>
                  <p className={`text-xs ${textMuted}`}>agendamentos</p>
                </div>
                <div className="text-center">
                  <p className={`text-xl font-bold text-blue-500`}>{filteredCheckins.length}</p>
                  <p className={`text-xs ${textMuted}`}>check-ins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Agendamentos e Check-ins */}
        <div className={`xl:col-span-2 ${cardClass} rounded-2xl overflow-hidden flex flex-col`}>
          {/* Tabs */}
          <div className={`flex border-b ${isDarkMode ? 'border-white/[0.08]' : 'border-gray-200'}`}>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`
                flex-1 px-4 py-3 text-sm font-medium transition-colors relative
                ${activeTab === 'schedules' 
                  ? textPrimary 
                  : textMuted + ' hover:' + textSecondary
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Agendamentos
                {filteredSchedules.length > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                    {filteredSchedules.length}
                  </span>
                )}
              </span>
              {activeTab === 'schedules' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" 
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('checkins')}
              className={`
                flex-1 px-4 py-3 text-sm font-medium transition-colors relative
                ${activeTab === 'checkins' 
                  ? textPrimary 
                  : textMuted + ' hover:' + textSecondary
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <Car className="w-4 h-4" />
                Check-ins
                {filteredCheckins.length > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    {filteredCheckins.length}
                  </span>
                )}
              </span>
              {activeTab === 'checkins' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" 
                />
              )}
            </button>
          </div>

          {/* Header com Filtros */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-white/[0.08]' : 'border-gray-200'}`}>
            {activeTab === 'schedules' && (
              <div className="flex items-center gap-2 mb-3">
                <select
                  value={filterShift}
                  onChange={(e) => setFilterShift(e.target.value)}
                  className={`
                    text-xs px-2 py-1 rounded-lg border-0 outline-none cursor-pointer
                    ${isDarkMode ? 'bg-white/[0.05] text-gray-300' : 'bg-gray-100 text-gray-700'}
                  `}
                >
                  <option value="">Turno</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                  <option value="Integral">Integral</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className={`
                    text-xs px-2 py-1 rounded-lg border-0 outline-none cursor-pointer
                    ${isDarkMode ? 'bg-white/[0.05] text-gray-300' : 'bg-gray-100 text-gray-700'}
                  `}
                >
                  <option value="">Prioridade</option>
                  <option value="urgent">Urgente</option>
                  <option value="high">Alta</option>
                  <option value="normal">Normal</option>
                  <option value="low">Baixa</option>
                </select>
              </div>
            )}
            
            {/* Search */}
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-xl
              ${isDarkMode ? 'bg-white/[0.05]' : 'bg-gray-100'}
            `}>
              <Search className={`w-4 h-4 ${textMuted}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'schedules' ? "Buscar agendamento..." : "Buscar check-in..."}
                className={`
                  flex-1 bg-transparent text-sm outline-none
                  ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                `}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')}>
                  <X className={`w-4 h-4 ${textMuted}`} />
                </button>
              )}
            </div>
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : activeTab === 'schedules' ? (
              /* Lista de Agendamentos */
              filteredSchedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className={`p-4 rounded-2xl mb-4 ${isDarkMode ? 'bg-white/[0.05]' : 'bg-gray-100'}`}>
                    <Calendar className={`w-8 h-8 ${textMuted}`} />
                  </div>
                  <p className={`text-sm font-medium ${textSecondary}`}>Nenhum agendamento</p>
                  <p className={`text-xs ${textMuted} mt-1`}>para esta data</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredSchedules.map((schedule, index) => {
                    const priorityConfig = getPriorityConfig(schedule.priority);
                    const shiftConfig = getShiftConfig(schedule.shift);
                    
                    return (
                      <motion.div
                        key={schedule.firestoreId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          p-4 rounded-xl border-l-4 transition-all
                          ${isDarkMode ? 'bg-white/[0.03] hover:bg-white/[0.05]' : 'bg-gray-50 hover:bg-gray-100'}
                          ${priorityConfig.border}
                        `}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${priorityConfig.bg}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`} />
                              <span className={`text-xs font-medium ${priorityConfig.color}`}>
                                {priorityConfig.label}
                              </span>
                            </div>
                            {schedule.shift && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${shiftConfig.bg}`}>
                                <span className="text-xs">{shiftConfig.icon}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(schedule)}
                              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/[0.1]' : 'hover:bg-gray-200'}`}
                            >
                              <Edit2 className={`w-3.5 h-3.5 ${textMuted}`} />
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(schedule.firestoreId)}
                              className={`p-1.5 rounded-lg transition-colors hover:bg-red-500/10`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Clock className={`w-4 h-4 ${textMuted}`} />
                          <span className={`text-sm font-semibold ${textPrimary}`}>
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className={`w-4 h-4 ${textMuted}`} />
                          <span className={`text-sm ${textPrimary}`}>
                            {schedule.serviceType || 'Serviço não especificado'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <User className={`w-4 h-4 ${textMuted}`} />
                          <span className={`text-xs ${textSecondary}`}>
                            {getMemberName(schedule.memberId)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )
            ) : (
              /* Lista de Check-ins */
              filteredCheckins.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className={`p-4 rounded-2xl mb-4 ${isDarkMode ? 'bg-white/[0.05]' : 'bg-gray-100'}`}>
                    <Car className={`w-8 h-8 ${textMuted}`} />
                  </div>
                  <p className={`text-sm font-medium ${textSecondary}`}>Nenhum check-in</p>
                  <p className={`text-xs ${textMuted} mt-1`}>para esta data</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredCheckins.map((checkin, index) => {
                    const timeRemaining = getTimeRemaining(checkin.expectedDelivery || checkin.estimatedDelivery);
                    const isOverdue = timeRemaining?.text === 'Atrasado';
                    
                    return (
                      <motion.div
                        key={checkin.firestoreId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          p-4 rounded-xl border-l-4 transition-all
                          ${isDarkMode ? 'bg-white/[0.03] hover:bg-white/[0.05]' : 'bg-gray-50 hover:bg-gray-100'}
                          ${isOverdue 
                            ? 'border-red-500' 
                            : checkin.status === 'in-progress' 
                              ? 'border-blue-500' 
                              : 'border-green-500'
                          }
                        `}
                      >
                        {/* Status e Tempo */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`
                            flex items-center gap-1.5 px-2 py-1 rounded-lg
                            ${checkin.status === 'in-progress' 
                              ? isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
                              : isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-600'
                            }
                          `}>
                            {checkin.status === 'in-progress' ? (
                              <Play className="w-3 h-3" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            <span className="text-xs font-medium">
                              {checkin.status === 'in-progress' ? 'Em andamento' : 'Concluído'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {timeRemaining && (
                              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${timeRemaining.bg}`}>
                                <Timer className={`w-3 h-3 ${timeRemaining.color}`} />
                                <span className={`text-xs font-medium ${timeRemaining.color}`}>
                                  {timeRemaining.text}
                                </span>
                              </div>
                            )}
                            
                            {/* Botão de criar agendamento - só aparece se não tiver agendamento */}
                            {checkin.status === 'in-progress' && !hasScheduleForCheckin(checkin.firestoreId) && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCreateFromCheckin(checkin);
                                }}
                                className={`
                                  flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors
                                  ${isDarkMode 
                                    ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' 
                                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                  }
                                `}
                                title="Criar agendamento"
                              >
                                <CalendarPlus className="w-3 h-3" />
                                <span className="hidden sm:inline">Agendar</span>
                              </motion.button>
                            )}
                            
                            {/* Indicador de já agendado */}
                            {hasScheduleForCheckin(checkin.firestoreId) && (
                              <div className={`
                                flex items-center gap-1 px-2 py-1 rounded-lg text-xs
                                ${isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-600'}
                              `}>
                                <CheckCircle className="w-3 h-3" />
                                <span className="hidden sm:inline">Agendado</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Área clicável para ir ao check-in */}
                        <div 
                          className="cursor-pointer"
                          onClick={() => window.location.href = `/checkin/${checkin.firestoreId}`}
                        >

                        {/* Cliente */}
                        <div className="flex items-center gap-2 mb-2">
                          <User className={`w-4 h-4 ${textMuted}`} />
                          <span className={`text-sm font-semibold ${textPrimary}`}>
                            {checkin.clientName || 'Cliente não informado'}
                          </span>
                        </div>

                        {/* Veículo */}
                        <div className="flex items-center gap-2 mb-2">
                          <Car className={`w-4 h-4 ${textMuted}`} />
                          <span className={`text-sm ${textPrimary}`}>
                            {checkin.vehicleBrand} {checkin.vehicleModel} 
                            {checkin.vehiclePlate && <span className={textSecondary}> • {checkin.vehiclePlate}</span>}
                          </span>
                        </div>

                        {/* Serviço */}
                        {checkin.serviceType && (
                          <div className="flex items-center gap-2">
                            <Wrench className={`w-4 h-4 ${textMuted}`} />
                            <span className={`text-xs ${textSecondary}`}>
                              {checkin.serviceType}
                            </span>
                          </div>
                        )}

                        {/* Previsão de Entrega */}
                        {(checkin.expectedDelivery || checkin.estimatedDelivery) && (
                          <div 
                            className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-white/[0.05]' : 'border-gray-200'} cursor-pointer`}
                            onClick={() => window.location.href = `/checkin/${checkin.firestoreId}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-xs ${textMuted}`}>Previsão de entrega</span>
                              <span className={`text-xs font-medium ${textPrimary}`}>
                                {format(new Date(checkin.expectedDelivery || checkin.estimatedDelivery), "dd/MM 'às' HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                          </div>
                        )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingSchedule ? 'Editar Agendamento' : prefillFromCheckin ? 'Agendar Check-in' : 'Novo Agendamento'}
            subtitle={prefillFromCheckin 
              ? `${prefillFromCheckin.clientName || 'Cliente'} - ${prefillFromCheckin.vehicleBrand || ''} ${prefillFromCheckin.vehicleModel || ''}`
              : 'Preencha os dados para agendar um serviço'
            }
            size="2xl"
          >
            <ScheduleForm
              onSubmit={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}
              onClose={handleCloseModal}
              initialData={editingSchedule || prefillFromCheckin}
              selectedDate={selectedDate}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchedulePage;
