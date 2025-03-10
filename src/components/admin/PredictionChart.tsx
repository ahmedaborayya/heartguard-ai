import React from 'react';
import type { PredictionStats } from '../../types/admin';

// Mock data for demonstration
const MOCK_STATS: PredictionStats[] = [
  { date: '2025-02-01', count: 12, accuracy: 0.92 },
  { date: '2025-02-02', count: 15, accuracy: 0.87 },
  { date: '2025-02-03', count: 8, accuracy: 0.95 },
  { date: '2025-02-04', count: 20, accuracy: 0.90 },
  { date: '2025-02-05', count: 18, accuracy: 0.89 },
  { date: '2025-02-06', count: 25, accuracy: 0.92 },
  { date: '2025-02-07', count: 22, accuracy: 0.94 },
];

const PredictionChart: React.FC = () => {
  const [stats, setStats] = React.useState<PredictionStats[]>(MOCK_STATS);

  React.useEffect(() => {
    // This would be replaced with your actual API call
    const fetchStats = async () => {
      try {
        // Replace with your API call
        // const response = await fetch('/api/predictions/stats');
        // const data = await response.json();
        // setStats(data);
        
        // Using mock data for now
        setStats(MOCK_STATS);
      } catch (error) {
        console.error('Error fetching prediction stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="h-64">
      <div className="grid grid-cols-7 gap-2 h-full">
        {stats.map((stat) => (
          <div key={stat.date} className="flex flex-col justify-end">
            <div 
              className="bg-blue-500 rounded-t"
              style={{ height: `${(stat.count / Math.max(...stats.map(s => s.count))) * 100}%` }}
            />
            <div className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-top-left">
              {new Date(stat.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionChart;