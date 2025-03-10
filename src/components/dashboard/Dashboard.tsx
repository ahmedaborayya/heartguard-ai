import React from 'react';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BarChart3,
  Brain,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface HealthMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface RecentAssessment {
  id: string;
  date: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  score: number;
  factors: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  // Mock data - replace with actual data from your backend
  const metrics: HealthMetric[] = [
    { label: 'Risk Score', value: 75, change: 5, trend: 'up' },
    { label: 'Active Risk Factors', value: 3, change: -1, trend: 'down' },
    { label: 'Health Score', value: 82, change: 2, trend: 'up' },
    { label: 'Days Since Last Check', value: 7, change: 0, trend: 'stable' },
  ];

  const recentAssessments: RecentAssessment[] = [
    { id: '1', date: '2024-03-15', riskLevel: 'Low', score: 85, factors: 2 },
    { id: '2', date: '2024-03-01', riskLevel: 'Medium', score: 65, factors: 4 },
    { id: '3', date: '2024-02-15', riskLevel: 'High', score: 45, factors: 6 },
  ];

  const getTrendIcon = (trend: HealthMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiskColor = (level: RecentAssessment['riskLevel']) => {
    switch (level) {
      case 'High':
        return 'text-red-500 bg-red-50 border-red-100';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-50 border-yellow-100';
      case 'Low':
        return 'text-green-500 bg-green-50 border-green-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="flex items-stretch">
            <div className="flex-1 p-6">
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome back, {user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-gray-600 mb-4">
                  Here's a summary of your health status
                </p>
                
                <div className="grid grid-cols-4 gap-6">
                  {metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 relative overflow-hidden
                        hover:bg-white hover:shadow-md hover:border-gray-200
                        transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                        <span className={`
                          text-sm font-medium px-2 py-0.5 rounded-full
                          ${metric.change > 0 ? 'text-green-600 bg-green-50' : metric.change < 0 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'}
                        `}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-72 bg-gradient-to-br from-blue-500 to-blue-600 p-6 flex flex-col justify-between">
              <div className="text-white">
                <h3 className="font-semibold mb-1">Quick Assessment</h3>
                <p className="text-sm text-blue-100">Monitor your heart health status</p>
              </div>
              <Link
                to="/predict"
                className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
              >
                Start Assessment
                <Brain className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'History', desc: 'View past assessments', icon: Clock, tab: 'history' },
            { title: 'Insights', desc: 'Health analytics', icon: BarChart3, tab: 'health' },
            { title: 'Profile', desc: 'Update information', icon: Users, tab: 'profile' }
          ].map((item) => (
            <Link
              key={item.title}
              to="/profile"
              state={{ activeTab: item.tab }}
              className="
                group
                p-4 bg-white rounded-2xl shadow-md border border-gray-100
                hover:shadow-xl hover:border-blue-100 transition-all duration-300
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <item.icon className="w-7 h-7" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Assessments</h2>
              <p className="text-sm text-gray-500 mt-1">Your latest health evaluations</p>
            </div>
            <Link
              to="/profile"
              state={{ activeTab: 'history' }}
              className="
                flex items-center gap-1 px-4 py-2 rounded-xl
                text-blue-600 hover:text-white
                bg-blue-50 hover:bg-blue-600
                transition-all duration-300
              "
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="
                  group
                  flex items-center justify-between p-4
                  bg-gray-50 rounded-xl border border-transparent
                  hover:bg-white hover:border-gray-200 hover:shadow-md
                  transition-all duration-300
                "
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    p-3 rounded-xl
                    ${getRiskColor(assessment.riskLevel)}
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Assessment {assessment.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(assessment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Score: {assessment.score}
                    </p>
                    <p className="text-sm text-gray-500">
                      {assessment.factors} risk factors
                    </p>
                  </div>
                  <span className={`
                    px-4 py-1.5 rounded-xl text-sm font-medium
                    ${getRiskColor(assessment.riskLevel)}
                    group-hover:shadow-sm transition-all duration-300
                  `}>
                    {assessment.riskLevel} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trends Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Risk Score Trend</h2>
                <p className="text-sm text-gray-500 mt-1">Your risk level over time</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Chart placeholder - Implement with your preferred charting library
            </div>
          </div>

          {/* Activity Calendar */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Assessment Calendar</h2>
                <p className="text-sm text-gray-500 mt-1">Track your assessment schedule</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Calendar placeholder - Implement with your preferred calendar component
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 