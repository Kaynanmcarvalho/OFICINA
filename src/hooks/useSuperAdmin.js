/**
 * useSuperAdmin - Hook para verificar se usuário é super-admin
 * 
 * Super-admins são identificados por e-mail
 * Apenas eles podem acessar o SaaS Dashboard
 */

import { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';

// Lista de e-mails autorizados como super-admin
const SUPER_ADMIN_EMAILS = [
  'renier@reparo.com',
  'somotrelas@gmail.com',
  'naoacreditoemeu@gmail.com'
];

export const useSuperAdmin = () => {
  const { user } = useAuthStore();

  const isSuperAdmin = useMemo(() => {
    if (!user || !user.email) return false;
    
    const userEmail = user.email.toLowerCase().trim();
    return SUPER_ADMIN_EMAILS.includes(userEmail);
  }, [user]);

  return {
    isSuperAdmin,
    superAdminEmails: SUPER_ADMIN_EMAILS
  };
};

export default useSuperAdmin;
