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
  memberStatuses: [
    'Ativo',
    'Inativo',
    'Férias',
    'Licença',
    'Afastado'
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
  
  // Create new schedule
  createSchedule: async (scheduleData) => {
    set({ isLoading: true, error: null });
    try {
      const newSchedule = {
        ...scheduleData,
        scheduleId: `SCH-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'Agendado',
      };

      const scheduleWithId = await addDocument('schedules', newSchedule);

      set((state) => ({
        schedules: [scheduleWithId, ...state.schedules],
        isLoading: false,
      }));

      return { success: true, data: scheduleWithId };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update schedule
  updateSchedule: async (scheduleId, updates) => {
    set({ isLoading: true, error: null });
    try {
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
        collection(db, 'schedules'),
        orderBy('date', 'desc')
      );
      
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