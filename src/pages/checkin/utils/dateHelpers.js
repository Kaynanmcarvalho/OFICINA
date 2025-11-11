import { format, formatDistanceToNow, differenceInDays, differenceInHours, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Helper para converter e validar data
const toValidDate = (date) => {
  if (!date) return null;
  
  try {
    let dateObj;
    
    // Firebase Timestamp
    if (date?.toDate && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    }
    // String ou número
    else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date);
    }
    // Já é Date
    else if (date instanceof Date) {
      dateObj = date;
    }
    else {
      return null;
    }
    
    // Validar se é uma data válida
    return isValid(dateObj) ? dateObj : null;
  } catch (error) {
    console.error('Error converting date:', error);
    return null;
  }
};

export const formatDate = (date) => {
  const dateObj = toValidDate(date);
  if (!dateObj) return '';
  
  try {
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDateTime = (date) => {
  const dateObj = toValidDate(date);
  if (!dateObj) return '';
  
  try {
    return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};

export const formatTime = (date) => {
  const dateObj = toValidDate(date);
  if (!dateObj) return '';
  
  try {
    return format(dateObj, 'HH:mm', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

export const formatRelativeTime = (date) => {
  const dateObj = toValidDate(date);
  if (!dateObj) return '';
  
  try {
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: ptBR });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

export const getDaysSince = (date) => {
  const dateObj = toValidDate(date);
  if (!dateObj) return 0;
  
  try {
    return differenceInDays(new Date(), dateObj);
  } catch (error) {
    console.error('Error calculating days since:', error);
    return 0;
  }
};

export const getHoursSince = (date) => {
  const dateObj = toValidDate(date);
  if (!dateObj) return 0;
  
  try {
    return differenceInHours(new Date(), dateObj);
  } catch (error) {
    console.error('Error calculating hours since:', error);
    return 0;
  }
};

export const isToday = (date) => {
  const dateObj = toValidDate(date);
  if (!dateObj) return false;
  
  try {
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  } catch (error) {
    console.error('Error checking if today:', error);
    return false;
  }
};

export const isThisWeek = (date) => {
  const dateObj = toValidDate(date);
  if (!dateObj) return false;
  
  try {
    const daysSince = getDaysSince(dateObj);
    return daysSince >= 0 && daysSince <= 7;
  } catch (error) {
    console.error('Error checking if this week:', error);
    return false;
  }
};

export const isThisMonth = (date) => {
  const dateObj = toValidDate(date);
  if (!dateObj) return false;
  
  try {
    const today = new Date();
    return dateObj.getMonth() === today.getMonth() && dateObj.getFullYear() === today.getFullYear();
  } catch (error) {
    console.error('Error checking if this month:', error);
    return false;
  }
};
