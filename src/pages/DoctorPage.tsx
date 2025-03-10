import React from 'react';
import DoctorRoute from '../components/doctor/DoctorRoute';
import DoctorDashboard from '../components/doctor/DoctorDashboard';

const DoctorPage: React.FC = () => {
  return (
    <DoctorRoute>
      <DoctorDashboard />
    </DoctorRoute>
  );
};

export default DoctorPage; 