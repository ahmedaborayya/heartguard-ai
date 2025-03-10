import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Heart, 
  Activity, 
  AlertCircle,
  Clock,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { Patient, DoctorStats } from '../../types';

const DoctorDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const { user } = useAuthStore();
  const { assessments, loading, error, fetchDoctorAssessments } = useAssessmentStore();

  useEffect(() => {
    if (user?.id) {
      fetchDoctorAssessments(user.id);
    }
  }, [user?.id, fetchDoctorAssessments]);

  // Mock data - replace with actual API calls
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 45,
      gender: 'Male',
      phoneNumber: '+1 234 567 8900',
      lastAssessment: '2024-03-15',
      nextCheckup: '2024-04-15',
      riskLevel: 'High',
      doctorId: user?.id
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 35,
      gender: 'Female',
      phoneNumber: '+1 234 567 8901',
      lastAssessment: '2024-03-10',
      nextCheckup: '2024-05-10',
      riskLevel: 'Low',
      doctorId: user?.id
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      age: 52,
      gender: 'Male',
      phoneNumber: '+1 234 567 8902',
      lastAssessment: '2024-03-12',
      nextCheckup: '2024-04-12',
      riskLevel: 'Medium',
      doctorId: user?.id
    },
  ];

  const filteredPatients = mockPatients
    .filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(patient => filterRisk === 'All' || patient.riskLevel === filterRisk);

  const getRiskColor = (level: Patient['riskLevel']) => {
    switch (level) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
    }
  };

  const stats: DoctorStats = {
    totalPatients: mockPatients.length,
    highRiskPatients: mockPatients.filter(p => p.riskLevel === 'High').length,
    assessmentsToday: assessments.filter(a => 
      new Date(a.date).toDateString() === new Date().toDateString()
    ).length,
    pendingReviews: assessments.filter(a => a.status === 'pending').length
  };

  const statsDisplay = [
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'blue' },
    { label: 'High Risk', value: stats.highRiskPatients, icon: AlertCircle, color: 'red' },
    { label: 'Assessments Today', value: stats.assessmentsToday, icon: Activity, color: 'green' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: 'yellow' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">Manage your patients and assessments</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsDisplay.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Patient Management */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Patient List</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Risks</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
                <Button
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Add Patient
                </Button>
              </div>
            </div>
          </div>

          {/* Patient List */}
          <div className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <Link
                key={patient.id}
                to={`/patient/${patient.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">{patient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Last Assessment</p>
                      <p className="font-medium">{new Date(patient.lastAssessment).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Next Checkup</p>
                      <p className="font-medium">{new Date(patient.nextCheckup).toLocaleDateString()}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${getRiskColor(patient.riskLevel)}`}>
                      {patient.riskLevel} Risk
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              {/* Add appointment list here */}
              <p className="text-gray-600">No upcoming appointments</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              {/* Add risk distribution chart here */}
              <p className="text-gray-600">Distribution chart coming soon</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              {/* Add activity feed here */}
              <p className="text-gray-600">No recent activity</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 