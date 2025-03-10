import React, { useState, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown, ChevronUp, Calendar, Activity, Heart, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import type { Prediction } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { exportToPDF, exportToCSV, exportSinglePredictionToPDF } from '../../utils/exportUtils';
import { notify } from '../../utils/notifications';

// Mock data for demonstration
const generateMockPredictions = (count: number): Prediction[] => {
  const predictions: Prediction[] = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    predictions.push({
      id: `pred-${i}`,
      user_id: 'user-1',
      prediction_result: Math.random() > 0.5,
      prediction_date: date.toISOString(),
      bmi: Math.floor(Math.random() * 15) + 20,
      smoking: Math.random() > 0.7,
      alcohol_drinking: Math.random() > 0.7,
      stroke: Math.random() > 0.9,
      physical_health: Math.floor(Math.random() * 30),
      mental_health: Math.floor(Math.random() * 30),
      diff_walking: Math.random() > 0.8,
      sex: Math.random() > 0.5 ? 'Male' : 'Female',
      age_category: '40-44',
      race: 'White',
      diabetic: Math.random() > 0.8,
      physical_activity: Math.random() > 0.3,
      gen_health: 'Good',
      sleep_time: Math.floor(Math.random() * 4) + 5,
      asthma: Math.random() > 0.9,
      kidney_disease: Math.random() > 0.9,
      skin_cancer: Math.random() > 0.9
    });
  }
  
  return predictions;
};

const PredictionCard: React.FC<{ prediction: Prediction }> = ({ prediction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskColor = (level: Prediction['risk_level']) => {
    switch (level) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleExportSingle = () => {
    try {
      exportSinglePredictionToPDF(prediction);
      notify.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      notify.error('Failed to generate PDF report');
    }
  };

  return (
    <Card className="bg-white overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {new Date(prediction.prediction_date).toLocaleDateString()}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.prediction_result ? 'High' : prediction.prediction_result ? 'Medium' : 'Low')}`}>
              {prediction.prediction_result ? 'High Risk' : prediction.prediction_result ? 'Medium Risk' : 'Low Risk'}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Health Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(prediction.bmi * 10)}`}>
                {prediction.bmi * 10}
              </p>
            </div>
            <button
              onClick={handleExportSingle}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FileText className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Physical Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Physical Metrics
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">BMI</p>
                    <p className="text-lg font-semibold">{prediction.bmi}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Physical Health</p>
                    <p className="text-lg font-semibold">{prediction.physical_health} days/month</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Mental Health</p>
                    <p className="text-lg font-semibold">{prediction.mental_health} days/month</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Sleep Time</p>
                    <p className="text-lg font-semibold">{prediction.sleep_time} hours</p>
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Demographics
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Sex</p>
                    <p className="text-lg font-semibold">{prediction.sex}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Age Category</p>
                    <p className="text-lg font-semibold">{prediction.age_category}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Race</p>
                    <p className="text-lg font-semibold">{prediction.race}</p>
                  </div>
                </div>
              </div>

              {/* Health Conditions */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Health Conditions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Smoking', value: prediction.smoking },
                    { label: 'Alcohol', value: prediction.alcohol_drinking },
                    { label: 'Stroke History', value: prediction.stroke },
                    { label: 'Difficulty Walking', value: prediction.diff_walking },
                    { label: 'Diabetic', value: prediction.diabetic },
                    { label: 'Physical Activity', value: prediction.physical_activity },
                    { label: 'Asthma', value: prediction.asthma },
                    { label: 'Kidney Disease', value: prediction.kidney_disease },
                    { label: 'Skin Cancer', value: prediction.skin_cancer }
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-sm text-gray-600">{label}</p>
                      <p className="font-medium">{value ? 'Yes' : 'No'}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mt-2">
                  <p className="text-sm text-gray-600">General Health</p>
                  <p className="text-lg font-semibold">{prediction.gen_health}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const PredictionHistory: React.FC = () => {
  const { user } = useAuthStore();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPredictions();
    }
  }, [user]);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      
      // This would be replaced with your actual API call
      // const response = await fetch(`/api/predictions/history?userId=${user?.id}`);
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        const mockPredictions = generateMockPredictions(5);
        setPredictions(mockPredictions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading predictions:', error);
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      if (predictions.length === 0) {
        notify.error('No predictions to export');
        return;
      }

      if (format === 'pdf') {
        exportToPDF(predictions);
        notify.success('PDF exported successfully');
      } else {
        exportToCSV(predictions);
        notify.success('CSV exported successfully');
      }
    } catch (error) {
      console.error('Error exporting predictions:', error);
      notify.error('Failed to export predictions');
    }
  };

  if (loading) {
    return <div>Loading prediction history...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Prediction History</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => handleExport('pdf')}
          >
            <FileText className="w-4 h-4" />
            Export All PDF
          </Button>
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => handleExport('csv')}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {predictions.length === 0 ? (
        <div className="text-center py-8">
          <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No predictions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;