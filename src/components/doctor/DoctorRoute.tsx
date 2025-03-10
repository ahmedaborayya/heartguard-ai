import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface DoctorRouteProps {
  children: React.ReactNode;
}

const DoctorRoute: React.FC<DoctorRouteProps> = ({ children }) => {
  const { user } = useAuthStore();

  if (!user || user.role !== 'doctor') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default DoctorRoute; 