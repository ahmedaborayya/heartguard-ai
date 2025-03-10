import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, Activity, Heart, Brain } from 'lucide-react';
import StatCard from './StatCard';
import UserList from './UserList';
import PredictionChart from './PredictionChart';
import { useAdminStats } from './hooks/useAdminStats';

interface DashboardStats {
  totalUsers: number;
  totalPredictions: number;
  highRiskPredictions: number;
  averageAge: number;
}

interface AgeDistribution {
  ageGroup: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPredictions: 0,
    highRiskPredictions: 0,
    averageAge: 0,
  });

  const [ageDistribution, setAgeDistribution] = useState<AgeDistribution[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalUsers: 150,
      totalPredictions: 324,
      highRiskPredictions: 87,
      averageAge: 45,
    });

    setAgeDistribution([
      { ageGroup: '18-24', count: 20 },
      { ageGroup: '25-34', count: 45 },
      { ageGroup: '35-44', count: 35 },
      { ageGroup: '45-54', count: 25 },
      { ageGroup: '55-64', count: 15 },
      { ageGroup: '65+', count: 10 },
    ]);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Total Predictions"
          value={stats.totalPredictions}
          icon={<Activity className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="High Risk Cases"
          value={stats.highRiskPredictions}
          icon={<Heart className="w-6 h-6" />}
          color="red"
        />
        <StatCard
          title="Average Age"
          value={stats.averageAge}
          icon={<Brain className="w-6 h-6" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Age Distribution</h2>
          <div className="w-full overflow-x-auto">
            <BarChart
              width={600}
              height={300}
              data={ageDistribution}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Users" />
            </BarChart>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;