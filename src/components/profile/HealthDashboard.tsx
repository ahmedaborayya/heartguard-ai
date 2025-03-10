import React, { useState } from 'react';
import { Activity, Heart, Brain, Settings as Lungs, Scale, Clock, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { generateHealthReport } from '../../utils/healthReportUtils';
import { notify } from '../../utils/notifications';
import { notifyHealthUpdate } from '../../utils/notificationUtils';
import type { HealthMetric, RiskFactor } from '../../types';

const MetricCard: React.FC<{
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  trendDirection: 'up' | 'down' | 'neutral';
  color: string;
}> = ({ title, value, trend, icon, trendDirection, color }) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className={`absolute inset-0 opacity-5 bg-${color}-500 group-hover:opacity-10 transition-opacity`} />
      <div className="p-6 relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
            <p className={`text-sm mt-2 flex items-center gap-1 ${trendColors[trendDirection]}`}>
              {trendDirection === 'up' ? <TrendingUp className="w-4 h-4" /> :
               trendDirection === 'down' ? <TrendingDown className="w-4 h-4" /> :
               <Minus className="w-4 h-4" />}
              {trend}
            </p>
          </div>
          <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600`}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};

const RiskIndicator: React.FC<{ level: RiskFactor['level'] }> = ({ level }) => {
  const colors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${colors[level]}`} />
      <span className="text-sm capitalize">{level} Risk</span>
    </div>
  );
};

const HealthDashboard: React.FC = () => {
  const [activeTimeRange, setActiveTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Mock data
  const mockBMIData: HealthMetric[] = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 24 + Math.random() * 2
  })).reverse();

  const mockRiskFactors: RiskFactor[] = [
    {
      name: 'Blood Pressure',
      level: 'medium',
      value: 135,
      recommendation: 'Consider reducing sodium intake and increasing physical activity'
    },
    {
      name: 'Cholesterol',
      level: 'low',
      value: 180,
      recommendation: 'Maintain current healthy diet and exercise routine'
    },
    {
      name: 'Blood Sugar',
      level: 'high',
      value: 140,
      recommendation: 'Schedule a consultation with your healthcare provider'
    }
  ];

  const handleDownloadReport = async () => {
    try {
      const report = await generateHealthReport();
      // Handle report download
      notify.success('Health report downloaded successfully');
      notifyHealthUpdate();
    } catch (error) {
      console.error('Error generating report:', error);
      notify.error('Failed to generate health report');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Health Dashboard</h2>
        <Button 
          variant="secondary"
          onClick={handleDownloadReport}
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Heart Rate"
          value="72 bpm"
          trend="↓ 3 from last week"
          icon={<Heart className="w-6 h-6" />}
          trendDirection="down"
          color="red"
        />
        <MetricCard
          title="BMI"
          value="24.5"
          trend="↑ 0.2 from last month"
          icon={<Scale className="w-6 h-6" />}
          trendDirection="up"
          color="blue"
        />
        <MetricCard
          title="Blood Pressure"
          value="120/80"
          trend="No change"
          icon={<Activity className="w-6 h-6" />}
          trendDirection="neutral"
          color="green"
        />
        <MetricCard
          title="Blood Sugar"
          value="95 mg/dL"
          trend="↓ 5 from last check"
          icon={<Brain className="w-6 h-6" />}
          trendDirection="down"
          color="purple"
        />
      </div>

      {/* BMI Trend Chart */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">BMI Trend</h3>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                variant={activeTimeRange === range ? 'primary' : 'secondary'}
                className={`text-sm px-4 py-2 ${
                  activeTimeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
                onClick={() => setActiveTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockBMIData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
                stroke="#6B7280"
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                stroke="#6B7280"
              />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value: number) => [value.toFixed(1), 'BMI']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  padding: '0.75rem'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#3B82F6', stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Factors Analysis</h3>
          <div className="space-y-6">
            {mockRiskFactors.map((factor) => (
              <div key={factor.name} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">{factor.name}</span>
                    <RiskIndicator level={factor.level} />
                  </div>
                  <span className="font-semibold text-gray-900">{factor.value}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {factor.recommendation}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Latest Health Check Overview */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Latest Health Check Overview</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-600">Cholesterol</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">180 mg/dL</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-600">Blood Sugar</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">95 mg/dL</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-600">Blood Pressure</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">120/80</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-600">Heart Rate</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">72 bpm</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              Last check: {new Date().toLocaleDateString()}
            </div>
          </div>
        </Card>
      </div>

      {/* Health Insights */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Health Insights</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-gray-700">Your blood pressure readings suggest maintaining current lifestyle habits</p>
          </li>
          <li className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-gray-700">Blood sugar levels are within normal range, continue regular monitoring</p>
          </li>
          <li className="flex items-start gap-3">
            <Lungs className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-gray-700">Schedule your next health checkup in 3 months based on current metrics</p>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default HealthDashboard;