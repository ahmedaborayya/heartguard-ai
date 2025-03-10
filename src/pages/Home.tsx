import React from 'react';
import { useAuthStore } from '../stores/authStore';
import Dashboard from '../components/dashboard/Dashboard';
import LandingPage from './LandingPage';

const Home: React.FC = () => {
  const { user } = useAuthStore();
  return user ? <Dashboard /> : <LandingPage />;
};

export default Home;