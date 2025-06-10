import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/index.jsx';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export { ProtectedRoute };