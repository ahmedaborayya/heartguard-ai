import { create } from 'zustand';

interface Prediction {
  id: string;
  date: string;
  result: boolean;
}

interface DashboardStats {
  totalUsers: number;
  totalPredictions: number;
  accuracyRate: number;
  recentPredictions: Prediction[];
}

interface DashboardState extends DashboardStats {
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

// Mock data for demonstration
const MOCK_STATS: DashboardStats = {
  totalUsers: 120,
  totalPredictions: 450,
  accuracyRate: 92.5,
  recentPredictions: [
    { id: '1', date: new Date().toISOString(), result: false },
    { id: '2', date: new Date(Date.now() - 86400000).toISOString(), result: true },
    { id: '3', date: new Date(Date.now() - 172800000).toISOString(), result: true },
    { id: '4', date: new Date(Date.now() - 259200000).toISOString(), result: false },
    { id: '5', date: new Date(Date.now() - 345600000).toISOString(), result: true },
  ]
};

export const useDashboardStore = create<DashboardState>((set) => ({
  totalUsers: 0,
  totalPredictions: 0,
  accuracyRate: 0,
  recentPredictions: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      // This would be replaced with your actual API call
      // const response = await fetch('/api/dashboard/stats');
      // const data = await response.json();
      
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          set({
            ...MOCK_STATS,
            loading: false,
            error: null
          });
          resolve();
        }, 1500);
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
        loading: false 
      });
    }
  }
}));