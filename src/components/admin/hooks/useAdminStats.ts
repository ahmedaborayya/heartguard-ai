import { useState, useEffect } from 'react';
import type { AdminStats } from '../../../types/admin';

// Mock data for demonstration
const MOCK_STATS: AdminStats = {
  totalUsers: 120,
  totalPredictions: 450,
  activeUsers: 85,
  averageAccuracy: 92.5,
};

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>(MOCK_STATS);

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchStats = async () => {
      try {
        // Replace with your API call
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        // setStats(data);
        
        // Using mock data for now
        setStats(MOCK_STATS);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  return stats;
};