import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, Heart, Activity, Brain, Stethoscope, ArrowRight, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { RiskFactor, HealthScore } from '../../types';
import HealthScoreCard from './HealthScoreCard';

interface RiskFactorsAnalysisProps {
  riskFactors: RiskFactor[];
  prediction: number | null;
}

const RiskFactorsAnalysis: React.FC<RiskFactorsAnalysisProps> = ({ riskFactors, prediction }) => {
  const getRiskColor = (level: RiskFactor['level']) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: RiskFactor['level']) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <HelpCircle className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const highRiskFactors = riskFactors.filter(f => f.level === 'high');
  const mediumRiskFactors = riskFactors.filter(f => f.level === 'medium');
  const lowRiskFactors = riskFactors.filter(f => f.level === 'low');

  // Calculate health score
  const calculateHealthScore = (): HealthScore => {
    const lifestyleFactors = riskFactors.filter(f => 
      ['Smoking', 'Alcohol Consumption', 'Physical Activity', 'Sleep Pattern'].includes(f.name)
    );
    const medicalFactors = riskFactors.filter(f => 
      ['Heart Disease', 'Stroke', 'Diabetes', 'Asthma', 'Kidney Disease'].includes(f.name)
    );
    const biometricFactors = riskFactors.filter(f => 
      ['BMI', 'Physical Health', 'Mental Health'].includes(f.name)
    );

    const calculateCategoryScore = (factors: RiskFactor[]) => {
      if (factors.length === 0) return 100;
      const totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
      return Math.round(totalScore / factors.length);
    };

    return {
      overall: Math.round(
        (calculateCategoryScore(lifestyleFactors) +
        calculateCategoryScore(medicalFactors) +
        calculateCategoryScore(biometricFactors)) / 3
      ),
      breakdown: {
        lifestyle: calculateCategoryScore(lifestyleFactors),
        medical: calculateCategoryScore(medicalFactors),
        biometric: calculateCategoryScore(biometricFactors)
      },
      highRiskCount: highRiskFactors.length,
      mediumRiskCount: mediumRiskFactors.length,
      lowRiskCount: lowRiskFactors.length
    };
  };

  const healthScore = calculateHealthScore();

  const handleDownloadPDF = () => {
    // Implementation for PDF download will be added
    console.log('Downloading PDF...');
  };

  const getTrendIndicator = (trend: RiskFactor['trend']) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="mt-12 space-y-8">
      {/* Prediction Result Banner */}
      <div className={`rounded-2xl shadow-lg overflow-hidden ${
        prediction ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'
      }`}>
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {prediction ? 'High Risk of Heart Failure' : 'Low Risk of Heart Failure'}
              </h2>
              <p className="text-white/80 mt-1">
                Based on your health data and risk factors
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-lg font-semibold px-6 py-2 rounded-full bg-white/20 text-white`}>
              {prediction ? 'Take Action Now' : 'Maintain Healthy Habits'}
            </div>
            <button
              onClick={handleDownloadPDF}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              title="Download Report"
            >
              <Download className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Health Score Overview */}
      <HealthScoreCard score={healthScore} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Factors Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              Risk Factor Analysis
            </h3>

            {highRiskFactors.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-medium text-red-600 mb-4">High Risk Factors</h4>
                <div className="space-y-4">
                  {highRiskFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-red-200 bg-red-50"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900">{factor.name}</h5>
                            {getTrendIndicator(factor.trend)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {typeof factor.value === 'number' 
                              ? `Current value: ${factor.value}`
                              : `Status: ${factor.value}`}
                            {factor.previousValue && 
                              ` (Previous: ${factor.previousValue})`}
                          </p>
                          <p className="text-sm font-medium text-red-700 mt-2">
                            {factor.recommendation}
                          </p>
                          {factor.details && (
                            <ul className="mt-2 space-y-1">
                              {factor.details.map((detail, i) => (
                                <li key={i} className="text-sm text-gray-600">• {detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mediumRiskFactors.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-medium text-yellow-600 mb-4">Moderate Risk Factors</h4>
                <div className="space-y-4">
                  {mediumRiskFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-yellow-200 bg-yellow-50"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-yellow-600 mt-1" />
                        <div>
                          <h5 className="font-medium text-gray-900">{factor.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {typeof factor.value === 'number' 
                              ? `Current value: ${factor.value}`
                              : `Status: ${factor.value}`}
                          </p>
                          <p className="text-sm font-medium text-yellow-700 mt-2">
                            {factor.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lowRiskFactors.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-green-600 mb-4">Well-Managed Factors</h4>
                <div className="space-y-4">
                  {lowRiskFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-green-200 bg-green-50"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                        <div>
                          <h5 className="font-medium text-gray-900">{factor.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {typeof factor.value === 'number' 
                              ? `Current value: ${factor.value}`
                              : `Status: ${factor.value}`}
                          </p>
                          <p className="text-sm font-medium text-green-700 mt-2">
                            {factor.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              Action Plan
            </h3>

            <div className="space-y-6">
              {/* Immediate Actions */}
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Immediate Actions
                </h4>
                <ul className="space-y-3">
                  {highRiskFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-700">
                      <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span className="text-sm">{factor.recommendation}</span>
                    </li>
                  ))}
                  {highRiskFactors.length === 0 && (
                    <li className="text-sm text-blue-700">
                      Continue maintaining your current healthy practices.
                    </li>
                  )}
                </ul>
              </div>

              {/* Lifestyle Recommendations */}
              <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-3">Lifestyle Modifications</h4>
                <ul className="space-y-3">
                  <li className="text-sm text-purple-700">• Regular exercise (150+ minutes/week)</li>
                  <li className="text-sm text-purple-700">• Heart-healthy diet rich in fruits and vegetables</li>
                  <li className="text-sm text-purple-700">• Adequate sleep (7-9 hours nightly)</li>
                  <li className="text-sm text-purple-700">• Stress management techniques</li>
                  <li className="text-sm text-purple-700">• Regular blood pressure monitoring</li>
                </ul>
              </div>

              {/* Follow-up Care */}
              <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                <h4 className="font-medium text-green-800 mb-3">Follow-up Care</h4>
                <ul className="space-y-3">
                  <li className="text-sm text-green-700">• Schedule regular check-ups</li>
                  <li className="text-sm text-green-700">• Monitor your risk factors</li>
                  <li className="text-sm text-green-700">• Keep a health diary</li>
                  <li className="text-sm text-green-700">• Join support groups or health programs</li>
                  <li className="text-sm text-green-700">• Regular cardiovascular screenings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskFactorsAnalysis; 