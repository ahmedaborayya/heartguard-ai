import React, { useState } from 'react';
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

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  lastAssessment: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  nextCheckup: string;
}

const DoctorDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  // Mock data - replace with actual API calls
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 45,
      lastAssessment: '2024-03-15',
      riskLevel: 'High',
      nextCheckup: '2024-04-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 35,
      lastAssessment: '2024-03-10',
      riskLevel: 'Low',
      nextCheckup: '2024-05-10'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      age: 52,
      lastAssessment: '2024-03-12',
      riskLevel: 'Medium',
      nextCheckup: '2024-04-12'
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

  const stats = [
    { label: 'Total Patients', value: mockPatients.length, icon: Users, color: 'blue' },
    { label: 'High Risk', value: mockPatients.filter(p => p.riskLevel === 'High').length, icon: AlertCircle, color: 'red' },
    { label: 'Assessments Today', value: 3, icon: Activity, color: 'green' },
    { label: 'Pending Reviews', value: 5, icon: Clock, color: 'yellow' },
  ];

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
          {stats.map((stat) => (
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
        <Card className="mb-8">
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
              <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                    <Link
                      to={`/patient/${patient.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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