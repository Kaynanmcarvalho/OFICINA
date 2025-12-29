import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Car, 
  Wrench, 
  FileText, 
  AlertCircle,
  X,
  Check,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTeamStore, useClientStore, useVehicleStore, useThemeStore } from '../../store';

const ScheduleForm = ({ onSubmit, onClose, initialData = null, selectedDate = null }) => {
  const { isDarkMode } = useThemeStore();
  const { members, fetchMembers } = useTeamStore();
  const { clients, fetchClients } = useClientStore();
  const { vehicles, fetchVehicles } = useVehicleStore();

  const [formData, setFormData] = useState({
    memberId: initialData?.memberId || '',
    clientId: initialData?.clientId || '',
    clientName: initialData?.clientName || '',
    vehicleId: initialData?.vehicleId || '',
    vehicleInfo: initialData?.vehicleBrand && initialData?.vehicleModel 
      ? `${initialData.vehicleBrand} ${initialData.vehicleModel} ${initialData.vehiclePlate ? '• ' + initialData.vehiclePlate : ''}`
      : '',
    date: initialData?.date || selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    startTime: initialData?.startTime || '08:00',
    endTime: initialData?.endTime || '17:00',
    shift: initialData?.shift || 'Manhã',
    serviceType: initialData?.serviceType || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'normal',
    notes: initialData?.notes || '',
    checkinId: initialData?.checkinId || '',
  });

  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    fetchMembers();
    fetchClients();
    fetchVehicles();
  }, [fetchMembers, fetchClients, fetchVehicles]);

  const shifts = [
    { value: 'Manhã', icon: '🌅', label: 'Manhã', time: '06:00 - 12:00' },
    { value: 'Tarde', icon: '☀️', label: 'Tarde', time: '12:00 - 18:00' },
    { value: 'Noite', icon: '🌙', label: 'Noite', time: '18:00 - 00:00' },
    { value: 'Integral', icon: '📅', label: 'Integral', time: 'Dia todo' }
  ];

  const serviceTypes = [
    { value: 'Revisão', icon: '🔍' },
    { value: 'Manutenção', icon: '🔧' },
    { value: 'Reparo', icon: '🛠️' },
    { value: 'Montagem', icon: '⚙️' },
    { value: 'Customização', icon: '✨' },
    { value: 'Diagnóstico', icon: '📊' },
    { value: 'Troca de Óleo', icon: '🛢️' },
    { value: 'Outros', icon: '📋' }
  ];

  const priorities = [
    { value: 'low', label: 'Baixa', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', dot: 'bg-gray-400' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
    { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', dot: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.memberId || !formData.date || !formData.serviceType) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);

    // Incluir checkinId se existir
    const dataToSubmit = { 
      ...formData, 
      hours,
      ...(formData.checkinId && { checkinId: formData.checkinId })
    };

    onSubmit(dataToSubmit);
  };

  const activeMembers = members.filter(m => m.status === 'Ativo');

  // Classes base
  const cardBg = isDarkMode ? 'bg-[#1C1E26]' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-[#14161D] border-white/[0.08]' : 'bg-gray-50 border-gray-200';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDarkMode ? 'text-gray-500' : 'text-gray-400';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header com Data e Horário */}
      <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'} border ${isDarkMode ? 'border-orange-500/20' : 'border-orange-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Data */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-2`}>
              <Calendar className="w-4 h-4 text-orange-500" />
              Data do Agendamento
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none`}
            />
          </div>

          {/* Horário Início */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-2`}>
              <Clock className="w-4 h-4 text-orange-500" />
              Início
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none`}
            />
          </div>

          {/* Horário Fim */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-2`}>
              <Clock className="w-4 h-4 text-orange-500" />
              Término
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none`}
            />
          </div>
        </div>
      </div>

      {/* Turno - Seleção Visual */}
      <div>
        <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-3`}>
          Turno
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {shifts.map((shift) => (
            <motion.button
              key={shift.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData(prev => ({ ...prev, shift: shift.value }))}
              className={`
                p-3 rounded-xl border-2 transition-all text-center
                ${formData.shift === shift.value
                  ? 'border-orange-500 bg-orange-500/10'
                  : isDarkMode 
                    ? 'border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]' 
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }
              `}
            >
              <span className="text-2xl mb-1 block">{shift.icon}</span>
              <span className={`text-sm font-medium ${formData.shift === shift.value ? 'text-orange-500' : textPrimary}`}>
                {shift.label}
              </span>
              <span className={`text-xs block ${textMuted}`}>{shift.time}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Funcionário e Cliente - Grid Horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Funcionário */}
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-2`}>
            <User className="w-4 h-4 text-blue-500" />
            Funcionário Responsável *
          </label>
          <div className="relative">
            <select
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer`}
            >
              <option value="">Selecione um funcionário...</option>
              {activeMembers.map(member => (
                <option key={member.firestoreId} value={member.firestoreId}>
                  {member.name} • {member.role}
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted} pointer-events-none`} />
          </div>
        </div>

        {/* Cliente */}
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-2`}>
            <User className="w-4 h-4 text-green-500" />
            Cliente
          </label>
          <div className="relative">
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none appearance-none cursor-pointer`}
            >
              <option value="">Selecione um cliente...</option>
              {clients.map(client => (
                <option key={client.firestoreId} value={client.firestoreId}>
                  {client.name}
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted} pointer-events-none`} />
          </div>
        </div>
      </div>

      {/* Veículo */}
      <div>
        <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-2`}>
          <Car className="w-4 h-4 text-purple-500" />
          Veículo
        </label>
        <div className="relative">
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none appearance-none cursor-pointer`}
          >
            <option value="">Selecione um veículo...</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.firestoreId} value={vehicle.firestoreId}>
                {vehicle.brand} {vehicle.model} • {vehicle.plate}
              </option>
            ))}
          </select>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted} pointer-events-none`} />
        </div>
      </div>

      {/* Tipo de Serviço - Grid Visual */}
      <div>
        <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-3`}>
          <Wrench className="w-4 h-4 text-orange-500" />
          Tipo de Serviço *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {serviceTypes.map((service) => (
            <motion.button
              key={service.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData(prev => ({ ...prev, serviceType: service.value }))}
              className={`
                px-3 py-2.5 rounded-xl border-2 transition-all flex items-center gap-2
                ${formData.serviceType === service.value
                  ? 'border-orange-500 bg-orange-500/10'
                  : isDarkMode 
                    ? 'border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]' 
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }
              `}
            >
              <span className="text-lg">{service.icon}</span>
              <span className={`text-sm font-medium ${formData.serviceType === service.value ? 'text-orange-500' : textPrimary}`}>
                {service.value}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Prioridade */}
      <div>
        <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-3`}>
          <AlertCircle className="w-4 h-4 text-orange-500" />
          Prioridade
        </label>
        <div className="flex flex-wrap gap-2">
          {priorities.map((priority) => (
            <motion.button
              key={priority.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
              className={`
                px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2
                ${formData.priority === priority.value
                  ? `border-current ${priority.color}`
                  : isDarkMode 
                    ? 'border-white/[0.08] hover:border-white/[0.15]' 
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className={`w-2 h-2 rounded-full ${priority.dot}`} />
              <span className={`text-sm font-medium ${formData.priority === priority.value ? '' : textPrimary}`}>
                {priority.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Descrição e Observações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-2`}>
            <FileText className="w-4 h-4 text-blue-500" />
            Descrição do Serviço
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Descreva o serviço a ser realizado..."
            className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none resize-none placeholder:${textMuted}`}
          />
        </div>

        <div>
          <label className={`flex items-center gap-2 text-sm font-medium ${textSecondary} mb-2`}>
            <FileText className="w-4 h-4 text-gray-500" />
            Observações
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Observações adicionais..."
            className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 transition-all outline-none resize-none placeholder:${textMuted}`}
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDarkMode ? 'border-white/[0.08]' : 'border-gray-200'}`}>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors
            ${isDarkMode 
              ? 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }
          `}
        >
          <X className="w-4 h-4" />
          Cancelar
        </motion.button>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-orange-500/25"
        >
          <Check className="w-4 h-4" />
          {initialData ? 'Atualizar Agendamento' : 'Criar Agendamento'}
        </motion.button>
      </div>
    </form>
  );
};

export default ScheduleForm;
