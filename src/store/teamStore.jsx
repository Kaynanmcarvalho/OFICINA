import { create } from 'zustand';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  subscribeToCollection
} from '../services/storeHelpers';
export const useTeamStore = create((set, get) => ({
  // State
  members: [],
  schedules: [],
  currentMember: null,
  currentSchedule: null,
  isLoading: false,
  error: null,
  filters: {
    role: '',
    status: '',
    shift: '',
    date: null,
  },
  roles: [
    'Mecânico Senior',
    'Mecânico Junior',
    'Eletricista',
    'Soldador',
    'Pintor',
    'Atendente',
    'Gerente',
    'Auxiliar'
  ],
  shifts: [
    'Manhã',
    'Tarde',
    'Noite',
    'Integral'
  ],
  scheduleStatuses: [
    'Agendado',
    'Confirmado',
    'Em Andamento',
    'Pausado',
    'Atrasado',
    'Concluído',
    'Cancelado',
    'Não Compareceu'
  ],

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: { role: '', status: '', shift: '', date: null } }),

  // Team Member Management
  
  // Create new team member
  createMember: async (memberData) => {
    set({ isLoading: true, error: null });
    try {
      const newMember = {
        ...memberData,
        memberId: `MEM-${Date.now()}`,
        status: 'Ativo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hireDate: memberData.hireDate || new Date().toISOString(),
        totalHours: 0,
        completedServices: 0,
        skills: memberData.skills || [],
        certifications: memberData.certifications || [],
        performanceRating: 0,
        attendanceRecord: [],
      };

      const memberWithId = await addDocument('team_members', newMember);

      set((state) => ({
        members: [memberWithId, ...state.members],
        isLoading: false,
      }));

      return { success: true, data: memberWithId };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update team member
  updateMember: async (memberId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDocument('team_members', memberId, updatedData);

      set((state) => ({
        members: state.members.map((member) =>
          member.firestoreId === memberId
            ? { ...member, ...updatedData }
            : member
        ),
        currentMember: state.currentMember?.firestoreId === memberId
          ? { ...state.currentMember, ...updatedData }
          : state.currentMember,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete team member
  deleteMember: async (memberId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDocument('team_members', memberId);

      set((state) => ({
        members: state.members.filter((member) => member.firestoreId !== memberId),
        currentMember: state.currentMember?.firestoreId === memberId ? null : state.currentMember,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Fetch all team members
  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const members = await getAllDocuments('team_members', {
      orderBy: { field: 'name', direction: 'asc' }
    });

      set({ members, isLoading: false });
      return { success: true, data: members };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get member by ID
  getMemberById: async (memberId) => {
    set({ isLoading: true, error: null });
    try {
      const docSnap = await getDocumentById('team_members', memberId);
      
      if (docSnap) {
        const member = docSnap;
        set({ currentMember: member, isLoading: false });
        return { success: true, data: member };
      } else {
        set({ error: 'Membro não encontrado', isLoading: false });
        return { success: false, error: 'Membro não encontrado' };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Schedule Management
  
  // Validate schedule data
  validateScheduleData: (scheduleData) => {
    const errors = [];
    
    // 1. Validar campos obrigatórios
    if (!scheduleData.date) errors.push('Data é obrigatória');
    if (!scheduleData.startTime) errors.push('Horário de início é obrigatório');
    if (!scheduleData.endTime) errors.push('Horário de término é obrigatório');
    if (!scheduleData.serviceType) errors.push('Tipo de serviço é obrigatório');
    
    // 2. Validar formato de horários
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (scheduleData.startTime && !timeRegex.test(scheduleData.startTime)) {
      errors.push('Horário de início inválido (use HH:MM)');
    }
    if (scheduleData.endTime && !timeRegex.test(scheduleData.endTime)) {
      errors.push('Horário de término inválido (use HH:MM)');
    }
    
    // 3. Validar se startTime < endTime
    if (scheduleData.startTime && scheduleData.endTime) {
      const [startH, startM] = scheduleData.startTime.split(':').map(Number);
      const [endH, endM] = scheduleData.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      
      if (startMinutes >= endMinutes) {
        errors.push('Horário de término deve ser após o horário de início');
      }
      
      // Validar duração mínima (15 min) e máxima (8 horas)
      const duration = endMinutes - startMinutes;
      if (duration < 15) errors.push('Duração mínima: 15 minutos');
      if (duration > 480) errors.push('Duração máxima: 8 horas');
    }
    
    // 4. Validar se data não está no passado
    if (scheduleData.date) {
      const today = new Date().toISOString().split('T')[0];
      if (scheduleData.date < today) {
        errors.push('Não é possível agendar em datas passadas');
      }
    }
    
    // 5. Validar horário de expediente (07:00 - 19:00)
    if (scheduleData.startTime) {
      const [startH] = scheduleData.startTime.split(':').map(Number);
      if (startH < 7 || startH >= 19) {
        errors.push('Horário de início deve estar entre 07:00 e 19:00');
      }
    }
    if (scheduleData.endTime) {
      const [endH] = scheduleData.endTime.split(':').map(Number);
      if (endH < 7 || endH > 19) {
        errors.push('Horário de término deve estar entre 07:00 e 19:00');
      }
    }
    
    // 6. Validar prioridade
    const validPriorities = ['urgent', 'high', 'normal', 'low'];
    if (scheduleData.priority && !validPriorities.includes(scheduleData.priority)) {
      errors.push('Prioridade inválida');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Check for scheduling conflicts
  checkScheduleConflicts: (scheduleData, excludeScheduleId = null) => {
    const { schedules } = get();
    const conflicts = [];
    
    // Converter horários para minutos para facilitar comparação
    const [newStartH, newStartM] = scheduleData.startTime.split(':').map(Number);
    const [newEndH, newEndM] = scheduleData.endTime.split(':').map(Number);
    const newStart = newStartH * 60 + newStartM;
    const newEnd = newEndH * 60 + newEndM;
    
    // Filtrar agendamentos do mesmo dia (excluindo cancelados e o próprio se for edição)
    const sameDaySchedules = schedules.filter(s =>
      s.date === scheduleData.date && 
      s.status !== 'Cancelado' &&
      s.status !== 'Concluído' &&
      s.firestoreId !== excludeScheduleId
    );
    
    sameDaySchedules.forEach(existing => {
      const [existStartH, existStartM] = existing.startTime.split(':').map(Number);
      const [existEndH, existEndM] = existing.endTime.split(':').map(Number);
      const existStart = existStartH * 60 + existStartM;
      const existEnd = existEndH * 60 + existEndM;
      
      // Verificar sobreposição de horários
      const hasTimeOverlap = (newStart < existEnd && newEnd > existStart);
      
      if (hasTimeOverlap) {
        // 1. Conflito de técnico
        if (scheduleData.memberId && existing.memberId === scheduleData.memberId) {
          conflicts.push({
            type: 'technician',
            message: `Técnico já alocado das ${existing.startTime} às ${existing.endTime}`,
            schedule: existing
          });
        }
        
        // 2. Conflito de box (se especificado)
        if (scheduleData.boxId && existing.boxId === scheduleData.boxId) {
          conflicts.push({
            type: 'box',
            message: `Box ${scheduleData.boxId} já ocupado das ${existing.startTime} às ${existing.endTime}`,
            schedule: existing
          });
        }
        
        // 3. Conflito de veículo (mesmo veículo não pode estar em dois lugares)
        if (scheduleData.vehicleId && existing.vehicleId === scheduleData.vehicleId) {
          conflicts.push({
            type: 'vehicle',
            message: `Veículo já agendado das ${existing.startTime} às ${existing.endTime}`,
            schedule: existing
          });
        }
      }
    });
    
    // 4. Verificar capacidade de boxes (máximo 3 boxes simultâneos)
    const MAX_BOXES = 3;
    const overlappingSchedules = sameDaySchedules.filter(existing => {
      const [existStartH, existStartM] = existing.startTime.split(':').map(Number);
      const [existEndH, existEndM] = existing.endTime.split(':').map(Number);
      const existStart = existStartH * 60 + existStartM;
      const existEnd = existEndH * 60 + existEndM;
      return (newStart < existEnd && newEnd > existStart);
    });
    
    if (overlappingSchedules.length >= MAX_BOXES) {
      conflicts.push({
        type: 'capacity',
        message: `Capacidade máxima atingida (${MAX_BOXES} boxes). ${overlappingSchedules.length} agendamentos simultâneos.`,
        count: overlappingSchedules.length
      });
    }
    
    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  },

  // Create new schedule with validations
  createSchedule: async (scheduleData) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Validar dados básicos
      const validation = get().validateScheduleData(scheduleData);
      if (!validation.isValid) {
        set({ isLoading: false });
        return { 
          success: false, 
          error: validation.errors.join('; '),
          validationErrors: validation.errors
        };
      }
      
      // 2. Verificar conflitos
      const conflictCheck = get().checkScheduleConflicts(scheduleData);
      if (conflictCheck.hasConflicts) {
        // Permitir apenas se for prioridade urgente
        if (scheduleData.priority !== 'urgent') {
          set({ isLoading: false });
          return { 
            success: false, 
            error: 'Conflito de agendamento detectado',
            conflicts: conflictCheck.conflicts
          };
        }
      }
      
      // 3. Calcular duração
      const [startH, startM] = scheduleData.startTime.split(':').map(Number);
      const [endH, endM] = scheduleData.endTime.split(':').map(Number);
      const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
      
      const newSchedule = {
        ...scheduleData,
        scheduleId: `SCH-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'Agendado',
        durationMinutes,
        priority: scheduleData.priority || 'normal',
        // Adicionar flag se foi criado com conflito (urgente)
        hasConflictOverride: conflictCheck.hasConflicts && scheduleData.priority === 'urgent',
      };

      const scheduleWithId = await addDocument('schedules', newSchedule);

      set((state) => ({
        schedules: [scheduleWithId, ...state.schedules],
        isLoading: false,
      }));

      return { 
        success: true, 
        data: scheduleWithId,
        warnings: conflictCheck.hasConflicts ? conflictCheck.conflicts : []
      };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update schedule with validations
  updateSchedule: async (scheduleId, updates) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Validar dados básicos (se houver mudanças relevantes)
      if (updates.date || updates.startTime || updates.endTime || updates.serviceType) {
        const currentSchedule = get().schedules.find(s => s.firestoreId === scheduleId);
        const dataToValidate = { ...currentSchedule, ...updates };
        
        const validation = get().validateScheduleData(dataToValidate);
        if (!validation.isValid) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: validation.errors.join('; '),
            validationErrors: validation.errors
          };
        }
        
        // 2. Verificar conflitos (excluindo o próprio agendamento)
        const conflictCheck = get().checkScheduleConflicts(dataToValidate, scheduleId);
        if (conflictCheck.hasConflicts) {
          if (updates.priority !== 'urgent') {
            set({ isLoading: false });
            return { 
              success: false, 
              error: 'Conflito de agendamento detectado',
              conflicts: conflictCheck.conflicts
            };
          }
        }
        
        // Recalcular duração se horários mudaram
        if (updates.startTime || updates.endTime) {
          const startTime = updates.startTime || currentSchedule.startTime;
          const endTime = updates.endTime || currentSchedule.endTime;
          const [startH, startM] = startTime.split(':').map(Number);
          const [endH, endM] = endTime.split(':').map(Number);
          updates.durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
        }
      }
      
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDocument('schedules', scheduleId, updatedData);

      set((state) => ({
        schedules: state.schedules.map((schedule) =>
          schedule.firestoreId === scheduleId
            ? { ...schedule, ...updatedData }
            : schedule
        ),
        currentSchedule: state.currentSchedule?.firestoreId === scheduleId
          ? { ...state.currentSchedule, ...updatedData }
          : state.currentSchedule,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete schedule
  deleteSchedule: async (scheduleId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDocument('schedules', scheduleId);

      set((state) => ({
        schedules: state.schedules.filter((schedule) => schedule.firestoreId !== scheduleId),
        currentSchedule: state.currentSchedule?.firestoreId === scheduleId ? null : state.currentSchedule,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Fetch schedules
  fetchSchedules: async (startDate = null, endDate = null) => {
    set({ isLoading: true, error: null });
    try {
      let q = query(
            );
        collection(db, 'schedules'),
        orderBy('date', 'desc')

      if (startDate) {
        q = query(q, where('date', '>=', startDate));
      }
      
      if (endDate) {
        q = query(q, where('date', '<=', endDate));
      }
      
      const querySnapshot = await getDocs(q);
      const schedules = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
      }));

      set({ schedules, isLoading: false });
      return { success: true, data: schedules };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Mark attendance
  markAttendance: async (memberId, date, status, notes = '') => {
    try {
      const member = get().members.find(m => m.firestoreId === memberId);
      if (!member) return { success: false, error: 'Membro não encontrado' };
      
      const attendanceRecord = {
        id: Date.now().toString(),
        date,
        status, // 'Presente', 'Ausente', 'Atrasado', 'Saída Antecipada'
        notes,
        timestamp: new Date().toISOString(),
      };
      
      const updatedAttendance = [attendanceRecord, ...(member.attendanceRecord || [])];
      
      await get().updateMember(memberId, {
        attendanceRecord: updatedAttendance,
      });
      
      return { success: true, data: attendanceRecord };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add skill to member
  addSkill: async (memberId, skill) => {
    try {
      const member = get().members.find(m => m.firestoreId === memberId);
      if (!member) return { success: false, error: 'Membro não encontrado' };
      
      const updatedSkills = [...(member.skills || []), skill];
      
      await get().updateMember(memberId, {
        skills: updatedSkills,
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove skill from member
  removeSkill: async (memberId, skillToRemove) => {
    try {
      const member = get().members.find(m => m.firestoreId === memberId);
      if (!member) return { success: false, error: 'Membro não encontrado' };
      
      const updatedSkills = member.skills.filter(skill => skill !== skillToRemove);
      
      await get().updateMember(memberId, {
        skills: updatedSkills,
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add certification to member
  addCertification: async (memberId, certification) => {
    try {
      const member = get().members.find(m => m.firestoreId === memberId);
      if (!member) return { success: false, error: 'Membro não encontrado' };
      
      const newCertification = {
        id: Date.now().toString(),
        ...certification,
        addedAt: new Date().toISOString(),
      };
      
      const updatedCertifications = [...(member.certifications || []), newCertification];
      
      await get().updateMember(memberId, {
        certifications: updatedCertifications,
      });
      
      return { success: true, data: newCertification };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get filtered members
  getFilteredMembers: () => {
    const { members, filters } = get();
    
    return members.filter(member => {
      if (filters.role && member.role !== filters.role) return false;
      if (filters.status && member.status !== filters.status) return false;
      if (filters.shift && member.preferredShift !== filters.shift) return false;
      
      return true;
    });
  },

  // Get members by role
  getMembersByRole: (role) => {
    const { members } = get();
    return members.filter(member => member.role === role);
  },

  // Get available members for date/time
  getAvailableMembers: (date, shift) => {
    const { members, schedules } = get();
    
    // Get members scheduled for this date/shift
    const scheduledMembers = schedules
      .filter(schedule => 
        schedule.date === date && 
        schedule.shift === shift &&
        schedule.status !== 'Cancelado'
      )
      .map(schedule => schedule.memberId);
    
    // Return active members not already scheduled
    return members.filter(member => 
      member.status === 'Ativo' && 
      !scheduledMembers.includes(member.firestoreId)
    );
  },

  // Get schedule for date
  getScheduleForDate: (date) => {
    const { schedules } = get();
    return schedules.filter(schedule => 
      schedule.date === date && 
      schedule.status !== 'Cancelado'
    );
  },

  // Get member schedule
  getMemberSchedule: (memberId, startDate = null, endDate = null) => {
    const { schedules } = get();
    
    return schedules.filter(schedule => {
      if (schedule.memberId !== memberId) return false;
      if (schedule.status === 'Cancelado') return false;
      
      if (startDate && schedule.date < startDate) return false;
      if (endDate && schedule.date > endDate) return false;
      
      return true;
    });
  },

  // Get capacity statistics for a specific date
  getCapacityStats: (date) => {
    const { schedules } = get();
    const MAX_BOXES = 3;
    const WORK_HOURS = 12; // 07:00 - 19:00
    const TOTAL_CAPACITY_MINUTES = MAX_BOXES * WORK_HOURS * 60; // 2160 minutos
    
    // Filtrar agendamentos do dia (excluindo cancelados)
    const daySchedules = schedules.filter(s =>
      s.date === date && 
      s.status !== 'Cancelado' &&
      s.status !== 'Concluído'
    );
    
    // Calcular minutos agendados
    const scheduledMinutes = daySchedules.reduce((total, schedule) => {
      return total + (schedule.durationMinutes || 60);
    }, 0);
    
    // Calcular taxa de ocupação
    const utilizationRate = (scheduledMinutes / TOTAL_CAPACITY_MINUTES) * 100;
    
    // Identificar horários de pico (agrupar por hora)
    const hourlyLoad = {};
    for (let h = 7; h < 19; h++) {
      hourlyLoad[h] = 0;
    }
    
    daySchedules.forEach(schedule => {
      const [startH] = schedule.startTime.split(':').map(Number);
      const [endH] = schedule.endTime.split(':').map(Number);
      for (let h = startH; h < endH; h++) {
        if (hourlyLoad[h] !== undefined) {
          hourlyLoad[h]++;
        }
      }
    });
    
    // Encontrar horários disponíveis
    const availableSlots = [];
    for (let h = 7; h < 19; h++) {
      if (hourlyLoad[h] < MAX_BOXES) {
        const slotsAvailable = MAX_BOXES - hourlyLoad[h];
        availableSlots.push({
          hour: `${h.toString().padStart(2, '0')}:00`,
          slotsAvailable
        });
      }
    }
    
    return {
      date,
      totalSchedules: daySchedules.length,
      scheduledMinutes,
      totalCapacityMinutes: TOTAL_CAPACITY_MINUTES,
      utilizationRate: Math.round(utilizationRate * 100) / 100,
      isNearFull: utilizationRate > 80,
      isFull: utilizationRate >= 100,
      availableSlots,
      hourlyLoad,
      peakHours: Object.entries(hourlyLoad)
        .filter(([_, count]) => count >= MAX_BOXES)
        .map(([hour]) => `${hour}:00`),
    };
  },

  // Get schedule statistics with capacity insights
  getScheduleStatistics: (startDate, endDate) => {
    const { schedules } = get();
    
    // Filtrar agendamentos no período
    const periodSchedules = schedules.filter(s => {
      if (!startDate || !endDate) return true;
      return s.date >= startDate && s.date <= endDate;
    });
    
    // Estatísticas por status
    const byStatus = {
      Agendado: periodSchedules.filter(s => s.status === 'Agendado').length,
      'Em Andamento': periodSchedules.filter(s => s.status === 'Em Andamento').length,
      Concluído: periodSchedules.filter(s => s.status === 'Concluído').length,
      Cancelado: periodSchedules.filter(s => s.status === 'Cancelado').length,
      'Não Compareceu': periodSchedules.filter(s => s.status === 'Não Compareceu').length,
    };
    
    // Taxa de no-show
    const totalCompleted = byStatus.Concluído + byStatus['Não Compareceu'];
    const noShowRate = totalCompleted > 0 
      ? (byStatus['Não Compareceu'] / totalCompleted) * 100 
      : 0;
    
    // Taxa de cancelamento
    const totalScheduled = periodSchedules.length;
    const cancellationRate = totalScheduled > 0
      ? (byStatus.Cancelado / totalScheduled) * 100
      : 0;
    
    // Estatísticas por prioridade
    const byPriority = {
      urgent: periodSchedules.filter(s => s.priority === 'urgent').length,
      high: periodSchedules.filter(s => s.priority === 'high').length,
      normal: periodSchedules.filter(s => s.priority === 'normal').length,
      low: periodSchedules.filter(s => s.priority === 'low').length,
    };
    
    // Duração média
    const totalDuration = periodSchedules.reduce((sum, s) => sum + (s.durationMinutes || 60), 0);
    const avgDuration = periodSchedules.length > 0 
      ? totalDuration / periodSchedules.length 
      : 0;
    
    return {
      total: periodSchedules.length,
      byStatus,
      byPriority,
      noShowRate: Math.round(noShowRate * 100) / 100,
      cancellationRate: Math.round(cancellationRate * 100) / 100,
      avgDuration: Math.round(avgDuration),
      completionRate: totalScheduled > 0 
        ? Math.round((byStatus.Concluído / totalScheduled) * 100 * 100) / 100
        : 0,
    };
  },

  // Get team statistics
  getTeamStatistics: () => {
    const { members, schedules } = get();
    
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'Ativo').length;
    const onVacation = members.filter(m => m.status === 'Férias').length;
    const onLeave = members.filter(m => m.status === 'Licença').length;
    
    // Role distribution
    const roleDistribution = {};
    members.forEach(member => {
      const role = member.role || 'Não Definido';
      roleDistribution[role] = (roleDistribution[role] || 0) + 1;
    });
    
    // Average performance rating
    const totalRating = members.reduce((sum, member) => sum + (member.performanceRating || 0), 0);
    const averageRating = totalMembers > 0 ? totalRating / totalMembers : 0;
    
    // Attendance rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let totalAttendanceRecords = 0;
    let presentRecords = 0;
    
    members.forEach(member => {
      const recentAttendance = (member.attendanceRecord || [])
        .filter(record => new Date(record.date) >= thirtyDaysAgo);
      
      totalAttendanceRecords += recentAttendance.length;
      presentRecords += recentAttendance.filter(record => record.status === 'Presente').length;
    });
    
    const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;
    
    // Upcoming schedules (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const today = new Date().toISOString().split('T')[0];
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    const upcomingSchedules = schedules.filter(schedule => 
      schedule.date >= today && 
      schedule.date <= nextWeekStr &&
      schedule.status !== 'Cancelado'
    ).length;
    
    return {
      totalMembers,
      activeMembers,
      onVacation,
      onLeave,
      roleDistribution,
      averageRating: Math.round(averageRating * 100) / 100,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      upcomingSchedules,
      utilizationRate: totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 0,
    };
  },

  // Get workload distribution
  getWorkloadDistribution: (startDate, endDate) => {
    const { schedules, members } = get();
    
    const workload = {};
    
    // Initialize workload for all active members
    members.filter(m => m.status === 'Ativo').forEach(member => {
      workload[member.firestoreId] = {
        member,
        scheduledHours: 0,
        scheduledDays: 0,
        shifts: [],
      };
    });
    
    // Calculate workload from schedules
    schedules
      .filter(schedule => 
        schedule.date >= startDate && 
        schedule.date <= endDate &&
        schedule.status !== 'Cancelado'
      )
      .forEach(schedule => {
        if (workload[schedule.memberId]) {
          workload[schedule.memberId].scheduledHours += schedule.hours || 8;
          workload[schedule.memberId].scheduledDays += 1;
          workload[schedule.memberId].shifts.push(schedule.shift);
        }
      });
    
    return Object.values(workload);
  },

  // Real-time listeners
  subscribeToMembers: () => {
    return subscribeToCollection('team_members', (members) => {
      set({ members });
    }, {
      orderBy: { field: 'name', direction: 'asc' }
    });
  },

  subscribeToSchedules: () => {
    return subscribeToCollection('schedules', (schedules) => {
      set({ schedules });
    }, {
      orderBy: { field: 'date', direction: 'desc' }
    });
  },
}));