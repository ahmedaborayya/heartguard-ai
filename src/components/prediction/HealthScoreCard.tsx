import React from 'react';
import { Heart, Activity, Stethoscope, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { HealthScore, RiskTrend } from '../../types';

interface HealthScoreCardProps {
  score: HealthScore;
}

const ScoreGauge: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="48"
            cy="48"
          />
          <circle
            className={getColor(value)}
            strokeWidth="8"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (value / 100) * 251.2}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="48"
            cy="48"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
          {value}
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
};

const TrendIndicator: React.FC<{ trend: RiskTrend }> = ({ trend }) => {
  const getIcon = () => {
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
    <div className="flex items-center gap-1">
      {getIcon()}
      <span className="text-sm capitalize">{trend}</span>
    </div>
  );
};

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ score }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500" />
        Health Score Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Overall Score */}
        <div className="md:col-span-1">
          <ScoreGauge value={score.overall} label="Overall Health" />
        </div>

        {/* Score Breakdown */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-800">Lifestyle</span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-700">{score.breakdown.lifestyle}</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-purple-800">Medical</span>
              <Stethoscope className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-700">{score.breakdown.medical}</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-green-800">Biometric</span>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-700">{score.breakdown.biometric}</div>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{score.highRiskCount}</div>
          <div className="text-sm font-medium text-red-600">High Risk Factors</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">{score.mediumRiskCount}</div>
          <div className="text-sm font-medium text-yellow-600">Medium Risk Factors</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{score.lowRiskCount}</div>
          <div className="text-sm font-medium text-green-600">Low Risk Factors</div>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreCard; 