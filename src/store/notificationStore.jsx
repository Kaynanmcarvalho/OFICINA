import { create } from 'zustand';

export const notificationStore = (set, get) => ({
  // Notification state
  notifications: [],
  unreadCount: 0,
  notificationSettings: {
    email: true,
    push: true,
    lowStock: true,
    serviceComplete: true,
    newCheckin: true,
    scheduleChanges: true,
  },

  // Notification actions
  addNotification: (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
    
    // Show toast notification if enabled
    if (window.enqueueSnackbar) {
      window.enqueueSnackbar(notification.message, {
        variant: notification.type || 'info',
        autoHideDuration: 5000,
      });
    }
    
    return newNotification.id;
  },

  markAsRead: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.map((notification) => {
        if (notification.id === notificationId && !notification.read) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      const unreadCount = notifications.filter((n) => !n.read).length;
      
      return { notifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
      unreadCount: 0,
    }));
  },

  removeNotification: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.filter(
        (notification) => notification.id !== notificationId
      );
      
      const unreadCount = notifications.filter((n) => !n.read).length;
      
      return { notifications, unreadCount };
    });
  },

  clearAllNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  updateNotificationSettings: (settings) => {
    set((state) => ({
      notificationSettings: { ...state.notificationSettings, ...settings },
    }));
  },

  // Notification helpers
  showSuccess: (message, options = {}) => {
    return get().addNotification({
      type: 'success',
      title: 'Sucesso',
      message,
      ...options,
    });
  },

  showError: (message, options = {}) => {
    return get().addNotification({
      type: 'error',
      title: 'Erro',
      message,
      ...options,
    });
  },

  showWarning: (message, options = {}) => {
    return get().addNotification({
      type: 'warning',
      title: 'Aviso',
      message,
      ...options,
    });
  },

  showInfo: (message, options = {}) => {
    return get().addNotification({
      type: 'info',
      title: 'Informação',
      message,
      ...options,
    });
  },

  // System notifications
  notifyLowStock: (partName, currentQuantity, minQuantity) => {
    const { notificationSettings } = get();
    if (!notificationSettings.lowStock) return;
    
    return get().addNotification({
      type: 'warning',
      title: 'Estoque Baixo',
      message: `A peça "${partName}" está com estoque baixo (${currentQuantity}/${minQuantity})`,
      category: 'inventory',
      data: { partName, currentQuantity, minQuantity },
    });
  },

  notifyServiceComplete: (clientName, serviceId) => {
    const { notificationSettings } = get();
    if (!notificationSettings.serviceComplete) return;
    
    return get().addNotification({
      type: 'success',
      title: 'Serviço Concluído',
      message: `Serviço para ${clientName} foi concluído`,
      category: 'service',
      data: { clientName, serviceId },
    });
  },

  notifyNewCheckin: (clientName, checkinId) => {
    const { notificationSettings } = get();
    if (!notificationSettings.newCheckin) return;
    
    return get().addNotification({
      type: 'info',
      title: 'Novo Check-in',
      message: `Nova moto de ${clientName} foi registrada`,
      category: 'checkin',
      data: { clientName, checkinId },
    });
  },

  notifyScheduleChange: (employeeName, date, type) => {
    const { notificationSettings } = get();
    if (!notificationSettings.scheduleChanges) return;
    
    return get().addNotification({
      type: 'info',
      title: 'Mudança na Escala',
      message: `Escala de ${employeeName} foi alterada para ${date}`,
      category: 'schedule',
      data: { employeeName, date, type },
    });
  },

  // Get notifications by category
  getNotificationsByCategory: (category) => {
    const { notifications } = get();
    return notifications.filter((notification) => notification.category === category);
  },

  // Get recent notifications
  getRecentNotifications: (limit = 10) => {
    const { notifications } = get();
    return notifications.slice(0, limit);
  },
});

// Create the useNotificationStore hook
export const useNotificationStore = create(notificationStore);