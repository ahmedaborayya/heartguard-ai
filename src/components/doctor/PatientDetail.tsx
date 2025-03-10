import React from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Activity, Brain, ArrowLeft, Clock, BarChart3 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

interface HealthMetric {
  label: string;
  value: string | number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

interface Assessment {
  id: string;
  date: string;
  riskScore: number;
  symptoms: string[];
  notes: string;
}

const PatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();

  // Mock data - replace with API calls
  const patient = {
    id: patientId,
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    lastAssessment: '2024-03-15',
    nextCheckup: '2024-04-15',
    riskLevel: 'High' as const
  };

  const healthMetrics: HealthMetric[] = [
    { label: 'Blood Pressure', value: '140/90', unit: 'mmHg', status: 'warning' },
    { label: 'Heart Rate', value: 75, unit: 'bpm', status: 'normal' },
    { label: 'Cholesterol', value: 240, unit: 'mg/dL', status: 'critical' },
    { label: 'Blood Sugar', value: 110, unit: 'mg/dL', status: 'normal' }
  ];

  const recentAssessments: Assessment[] = [
    {
      id: '1',
      date: '2024-03-15',
      riskScore: 75,
      symptoms: ['Chest Pain', 'Shortness of Breath'],
      notes: 'Patient reported increased frequency of symptoms'
    },
    {
      id: '2',
      date: '2024-02-15',
      riskScore: 65,
      symptoms: ['Fatigue'],
      notes: 'Regular checkup, minor concerns noted'
    }
  ];

  const getStatusColor = (status: HealthMetric['status']) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/doctor" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">Patient ID: {patient.id}</p>
            </div>
            <Button variant="primary" className="flex items-center gap-2">
              Schedule Checkup
              <Clock className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Patient Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-2 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium">{patient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Assessment</p>
                <p className="font-medium">{new Date(patient.lastAssessment).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Checkup</p>
                <p className="font-medium">{new Date(patient.nextCheckup).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Level</h2>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">High Risk</div>
                <p className="text-gray-600">Immediate attention required</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Health Metrics */}
        <Card className="mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Health Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {healthMetrics.map((metric) => (
              <div key={metric.label} className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Assessments */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Assessments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentAssessments.map((assessment) => (
              <div key={assessment.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(assessment.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Assessment ID: {assessment.id}</p>
                  </div>
                  <div className={`text-2xl font-bold ${getRiskScoreColor(assessment.riskScore)}`}>
                    {assessment.riskScore}%
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Notes</p>
                    <p className="text-gray-700">{assessment.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetail; 