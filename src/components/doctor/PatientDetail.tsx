import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Brain, 
  ArrowLeft, 
  Clock, 
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { useAuthStore } from '../../stores/authStore';
import { Assessment, HealthMetric } from '../../types';
import toast from 'react-hot-toast';

const PatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuthStore();
  const { 
    assessments, 
    loading, 
    error,
    fetchPatientAssessments,
    submitDoctorReview
  } = useAssessmentStore();
  
  const [expandedAssessment, setExpandedAssessment] = useState<string | null>(null);
  const [doctorFeedback, setDoctorFeedback] = useState<{ [key: string]: string }>({});
  const [followUpDates, setFollowUpDates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (patientId) {
      fetchPatientAssessments(patientId);
    }
  }, [patientId, fetchPatientAssessments]);

  // Mock data - replace with API calls
  const patient = {
    id: patientId,
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    lastAssessment: assessments[0]?.date || '',
    nextCheckup: assessments[0]?.details.followUpDate || '',
    riskLevel: assessments[0]?.riskScore >= 70 ? 'High' : assessments[0]?.riskScore >= 40 ? 'Medium' : 'Low'
  };

  const healthMetrics: HealthMetric[] = [
    { 
      label: 'Blood Pressure', 
      value: assessments[0]?.details.bloodPressure || '120/80', 
      unit: 'mmHg', 
      status: 'warning' 
    },
    { 
      label: 'Heart Rate', 
      value: assessments[0]?.details.heartRate || 75, 
      unit: 'bpm', 
      status: 'normal' 
    },
    { 
      label: 'Cholesterol', 
      value: assessments[0]?.details.cholesterol || 200, 
      unit: 'mg/dL', 
      status: 'critical' 
    },
    { 
      label: 'Blood Sugar', 
      value: assessments[0]?.details.bloodSugar || 100, 
      unit: 'mg/dL', 
      status: 'normal' 
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

  const toggleAssessment = (id: string) => {
    setExpandedAssessment(expandedAssessment === id ? null : id);
  };

  const handleFeedbackSubmit = async (assessmentId: string, status: 'reviewed' | 'needs_revision') => {
    const feedback = doctorFeedback[assessmentId];
    const followUpDate = followUpDates[assessmentId];

    if (!feedback || !followUpDate) {
      toast.error('Please provide both feedback and follow-up date');
      return;
    }

    try {
      await submitDoctorReview(assessmentId, {
        doctorNotes: feedback,
        recommendations: feedback,
        followUpDate,
        status
      });
      toast.success('Review submitted successfully');
      
      // Clear form
      setDoctorFeedback(prev => {
        const { [assessmentId]: _, ...rest } = prev;
        return rest;
      });
      setFollowUpDates(prev => {
        const { [assessmentId]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const getStatusBadge = (status: Assessment['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">Pending Review</span>;
      case 'reviewed':
        return <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Reviewed</span>;
      case 'needs_revision':
        return <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">Needs Revision</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Loading patient details...</p>
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
                <p className="font-medium">{patient.lastAssessment ? new Date(patient.lastAssessment).toLocaleDateString() : 'No assessments'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Checkup</p>
                <p className="font-medium">{patient.nextCheckup ? new Date(patient.nextCheckup).toLocaleDateString() : 'Not scheduled'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Level</h2>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getRiskScoreColor(assessments[0]?.riskScore || 0)}`}>
                  {patient.riskLevel} Risk
                </div>
                <p className="text-gray-600">
                  {patient.riskLevel === 'High' ? 'Immediate attention required' : 
                   patient.riskLevel === 'Medium' ? 'Monitor closely' : 
                   'Regular checkups advised'}
                </p>
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
            {assessments.map((assessment) => (
              <div key={assessment.id} className="p-6">
                <button
                  onClick={() => toggleAssessment(assessment.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(assessment.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">Assessment ID: {assessment.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(assessment.status)}
                      <div className={`text-2xl font-bold ${getRiskScoreColor(assessment.riskScore)}`}>
                        {assessment.riskScore}%
                      </div>
                      {expandedAssessment === assessment.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                <div className={`space-y-6 ${expandedAssessment === assessment.id ? 'block' : 'hidden'}`}>
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
                    <p className="text-sm text-gray-600 mb-2">Patient Notes</p>
                    <p className="text-gray-700">{assessment.notes}</p>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Assessment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Blood Pressure</p>
                        <p className="font-medium text-gray-900">{assessment.details.bloodPressure} mmHg</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Heart Rate</p>
                        <p className="font-medium text-gray-900">{assessment.details.heartRate} bpm</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Cholesterol</p>
                        <p className="font-medium text-gray-900">{assessment.details.cholesterol} mg/dL</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Blood Sugar</p>
                        <p className="font-medium text-gray-900">{assessment.details.bloodSugar} mg/dL</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Fasting Blood Sugar</p>
                        <p className="font-medium text-gray-900">{assessment.details.fastingBloodSugar} mg/dL</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Resting ECG</p>
                        <p className="font-medium text-gray-900">{assessment.details.restingECG}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Max Heart Rate</p>
                        <p className="font-medium text-gray-900">{assessment.details.maxHeartRate} bpm</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Exercise Angina</p>
                        <p className="font-medium text-gray-900">{assessment.details.exerciseAngina ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">ST Depression (Oldpeak)</p>
                        <p className="font-medium text-gray-900">{assessment.details.oldpeak}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Chest Pain Type</p>
                        <p className="font-medium text-gray-900">{assessment.details.chestPainType}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Current Medications</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.details.medications.map((medication) => (
                        <span
                          key={medication}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {medication}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Doctor's Review</h3>
                    
                    {assessment.status === 'reviewed' ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Review Date</p>
                          <p className="text-gray-900">{new Date(assessment.details.reviewDate!).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Doctor's Notes</p>
                          <p className="text-gray-900">{assessment.details.doctorNotes}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Follow-up Date</p>
                          <p className="text-gray-900">{new Date(assessment.details.followUpDate!).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Recommendations</p>
                          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                              <p className="text-yellow-800">{assessment.details.recommendations}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Doctor's Notes</label>
                          <textarea
                            value={doctorFeedback[assessment.id] || ''}
                            onChange={(e) => setDoctorFeedback({
                              ...doctorFeedback,
                              [assessment.id]: e.target.value
                            })}
                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                            placeholder="Enter your assessment and recommendations..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Schedule Follow-up</label>
                          <input
                            type="date"
                            value={followUpDates[assessment.id] || ''}
                            onChange={(e) => setFollowUpDates({
                              ...followUpDates,
                              [assessment.id]: e.target.value
                            })}
                            className="rounded-lg border border-gray-300 p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="secondary"
                            onClick={() => handleFeedbackSubmit(assessment.id, 'needs_revision')}
                          >
                            Mark for Revision
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => handleFeedbackSubmit(assessment.id, 'reviewed')}
                          >
                            Submit Review
                          </Button>
                        </div>
                      </div>
                    )}
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