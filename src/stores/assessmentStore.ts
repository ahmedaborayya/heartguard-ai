import { create } from 'zustand';
import { 
  Assessment, 
  PatientHealthSummary, 
  DoctorDashboardData,
  RiskFactor,
  HealthScore,
  Prediction
} from '../types';

interface AssessmentState {
  assessments: Assessment[];
  predictions: Prediction[];
  patientSummary: PatientHealthSummary | null;
  doctorDashboard: DoctorDashboardData | null;
  loading: boolean;
  error: string | null;
  // Actions
  fetchPatientAssessments: (patientId: string) => Promise<void>;
  fetchDoctorAssessments: (doctorId: string) => Promise<void>;
  fetchPatientPredictions: (patientId: string) => Promise<void>;
  fetchPatientSummary: (patientId: string) => Promise<void>;
  fetchDoctorDashboard: (doctorId: string) => Promise<void>;
  submitAssessment: (assessment: Omit<Assessment, 'id' | 'date' | 'status' | 'details'> & { 
    details: Omit<Assessment['details'], 'riskFactors' | 'healthScore'> 
  }) => Promise<void>;
  updateAssessment: (assessmentId: string, updates: Partial<Assessment>) => Promise<void>;
  submitDoctorReview: (
    assessmentId: string, 
    review: { 
      doctorNotes: string; 
      recommendations: string; 
      followUpDate: string;
      status: 'reviewed' | 'needs_revision';
    }
  ) => Promise<void>;
  submitPredictionReview: (
    predictionId: string,
    doctorReview: {
      doctor_id: string;
      doctor_name: string;
      notes: string;
      recommendations: string[];
      prescribed_medications?: string[];
      follow_up_date?: string;
      status: 'pending' | 'reviewed' | 'needs_followup';
      risk_level: 'low' | 'medium' | 'high';
      action_items: string[];
    }
  ) => Promise<void>;
}

// Helper functions for risk calculation
const calculateRiskFactors = (details: Assessment['details']): RiskFactor[] => {
  const factors: RiskFactor[] = [];
  
  // BMI Risk
  if (details.bmi >= 30) {
    factors.push({
      name: 'BMI',
      level: 'high',
      value: details.bmi,
      recommendation: 'Consider weight management program',
      trend: 'stable',
      score: 75
    });
  }

  // Blood Pressure Risk
  const [systolic, diastolic] = details.bloodPressure.split('/').map(Number);
  if (systolic >= 140 || diastolic >= 90) {
    factors.push({
      name: 'Blood Pressure',
      level: 'high',
      value: details.bloodPressure,
      recommendation: 'Monitor blood pressure daily',
      trend: 'increasing',
      score: 80
    });
  }

  // Add more risk factors...
  return factors;
};

const calculateHealthScore = (details: Assessment['details']): HealthScore => {
  // Calculate scores based on various metrics
  const lifestyleScore = calculateLifestyleScore(details);
  const medicalScore = calculateMedicalScore(details);
  const biometricScore = calculateBiometricScore(details);

  const overall = (lifestyleScore + medicalScore + biometricScore) / 3;

  return {
    overall,
    breakdown: {
      lifestyle: lifestyleScore,
      medical: medicalScore,
      biometric: biometricScore
    },
    highRiskCount: 0, // Calculate based on risk factors
    mediumRiskCount: 0,
    lowRiskCount: 0
  };
};

const calculateLifestyleScore = (details: Assessment['details']): number => {
  let score = 100;
  if (details.smoking) score -= 20;
  if (details.alcoholDrinking) score -= 15;
  if (!details.physicalActivity) score -= 10;
  if (details.sleepTime < 6 || details.sleepTime > 9) score -= 10;
  return Math.max(0, score);
};

const calculateMedicalScore = (details: Assessment['details']): number => {
  let score = 100;
  if (details.stroke) score -= 25;
  if (details.diabetic) score -= 15;
  if (details.asthma) score -= 10;
  if (details.kidneyDisease) score -= 20;
  if (details.skinCancer) score -= 15;
  return Math.max(0, score);
};

const calculateBiometricScore = (details: Assessment['details']): number => {
  let score = 100;
  if (details.bmi >= 30) score -= 15;
  if (details.exerciseAngina) score -= 20;
  if (details.oldpeak > 2) score -= 15;
  // Add more biometric calculations
  return Math.max(0, score);
};

// Mock data with enhanced structure
const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: '1',
    date: '2024-03-15',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    riskScore: 75,
    status: 'pending',
    symptoms: ['Chest Pain', 'Shortness of Breath'],
    notes: 'Patient reported increased frequency of symptoms',
    details: {
      age: 45,
      gender: 'Male',
      bloodPressure: '140/90',
      heartRate: 75,
      cholesterol: 240,
      bloodSugar: 110,
      fastingBloodSugar: 120,
      restingECG: 'Normal',
      maxHeartRate: 150,
      exerciseAngina: true,
      oldpeak: 2.5,
      chestPainType: 'Typical Angina',
      bmi: 32,
      smoking: true,
      alcoholDrinking: false,
      stroke: false,
      physicalHealth: 8,
      mentalHealth: 7,
      diffWalking: false,
      diabetic: true,
      physicalActivity: false,
      genHealth: 'Fair',
      sleepTime: 6,
      asthma: false,
      kidneyDisease: false,
      skinCancer: false,
      medications: ['Aspirin', 'Beta Blockers'],
      recommendations: 'Awaiting doctor review',
      riskFactors: [],
      healthScore: {
        overall: 0,
        breakdown: { lifestyle: 0, medical: 0, biometric: 0 },
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0
      }
    }
  }
  // Add more mock assessments...
];

// Add mock predictions data
const MOCK_PREDICTIONS: Prediction[] = [
  {
    id: '1',
    user_id: 'patient-1',
    prediction_result: true,
    prediction_date: '2024-03-15',
    bmi: 32,
    smoking: true,
    alcohol_drinking: false,
    stroke: false,
    physical_health: 8,
    mental_health: 7,
    diff_walking: false,
    sex: 'Male',
    age_category: '45-49',
    race: 'White',
    diabetic: true,
    physical_activity: false,
    gen_health: 'Fair',
    sleep_time: 6,
    asthma: false,
    kidney_disease: false,
    skin_cancer: false,
    doctor_review: {
      doctor_id: 'doctor-1',
      doctor_name: 'Dr. Smith',
      review_date: '2024-03-16',
      notes: 'Patient shows multiple risk factors that need attention',
      recommendations: [
        'Start a structured exercise program',
        'Monitor blood sugar levels daily',
        'Quit smoking with provided cessation program'
      ],
      prescribed_medications: ['Metformin', 'Nicotine patch'],
      follow_up_date: '2024-04-15',
      status: 'reviewed',
      risk_level: 'high',
      action_items: [
        'Schedule appointment with smoking cessation specialist',
        'Begin daily blood sugar monitoring',
        "Join hospital's diabetes management program"
      ]
    },
    reviewed_at: '2024-03-16',
    next_assessment_date: '2024-04-15',
    critical_findings: [
      'High BMI with diabetes',
      'Active smoker with cardiovascular risk'
    ],
    lifestyle_recommendations: [
      'Implement 30-minute daily walks',
      'Follow provided diabetic diet plan',
      'Use stress management techniques'
    ]
  }
];

export const useAssessmentStore = create<AssessmentState>((set) => ({
  assessments: [],
  predictions: [],
  patientSummary: null,
  doctorDashboard: null,
  loading: false,
  error: null,

  fetchPatientAssessments: async (patientId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const patientAssessments = MOCK_ASSESSMENTS
            .filter(a => a.patientId === patientId)
            .map(assessment => ({
              ...assessment,
              details: {
                ...assessment.details,
                riskFactors: calculateRiskFactors(assessment.details),
                healthScore: calculateHealthScore(assessment.details)
              }
            }));
          set({ assessments: patientAssessments, loading: false });
          resolve();
        }, 1000);
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch assessments', loading: false });
    }
  },

  fetchDoctorAssessments: async (doctorId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const doctorAssessments = MOCK_ASSESSMENTS
            .filter(a => a.doctorId === doctorId)
            .map(assessment => ({
              ...assessment,
              details: {
                ...assessment.details,
                riskFactors: calculateRiskFactors(assessment.details),
                healthScore: calculateHealthScore(assessment.details)
              }
            }));
          set({ assessments: doctorAssessments, loading: false });
          resolve();
        }, 1000);
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch assessments', loading: false });
    }
  },

  fetchPatientPredictions: async (patientId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const patientPredictions = MOCK_PREDICTIONS
            .filter(p => p.user_id === patientId);
          set({ predictions: patientPredictions, loading: false });
          resolve();
        }, 1000);
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch predictions', loading: false });
    }
  },

  fetchPatientSummary: async (patientId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const assessments = MOCK_ASSESSMENTS.filter(a => a.patientId === patientId);
          const summary: PatientHealthSummary = {
            currentAssessment: assessments[0],
            previousAssessment: assessments[1],
            riskTrend: 'stable',
            criticalMetrics: [
              { 
                label: 'Blood Pressure',
                value: assessments[0]?.details.bloodPressure || '120/80',
                unit: 'mmHg',
                status: 'warning'
              }
            ],
            upcomingAppointments: [],
            medicationSchedule: []
          };
          set({ patientSummary: summary, loading: false });
          resolve();
        }, 1000);
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch patient summary', loading: false });
    }
  },

  fetchDoctorDashboard: async (doctorId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const dashboard: DoctorDashboardData = {
            stats: {
              totalPatients: 10,
              highRiskPatients: 3,
              assessmentsToday: 2,
              pendingReviews: 5
            },
            upcomingAppointments: [],
            riskDistribution: {
              high: 3,
              medium: 4,
              low: 3,
              total: 10
            },
            recentActivity: []
          };
          set({ doctorDashboard: dashboard, loading: false });
          resolve();
        }, 1000);
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch doctor dashboard', loading: false });
    }
  },

  submitAssessment: async (assessment) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const details = {
            ...assessment.details,
            riskFactors: calculateRiskFactors(assessment.details),
            healthScore: calculateHealthScore(assessment.details)
          };
          
          const newAssessment: Assessment = {
            ...assessment,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            status: 'pending',
            details
          };
          
          set(state => ({ 
            assessments: [...state.assessments, newAssessment],
            loading: false 
          }));
          resolve();
        }, 1000);
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to submit assessment', loading: false });
    }
  },

  updateAssessment: async (assessmentId: string, updates: Partial<Assessment>) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          set(state => ({
            assessments: state.assessments.map(assessment =>
              assessment.id === assessmentId
                ? { 
                    ...assessment, 
                    ...updates,
                    details: {
                      ...assessment.details,
                      ...(updates.details || {}),
                      riskFactors: calculateRiskFactors({
                        ...assessment.details,
                        ...(updates.details || {})
                      }),
                      healthScore: calculateHealthScore({
                        ...assessment.details,
                        ...(updates.details || {})
                      })
                    }
                  }
                : assessment
            ),
            loading: false
          }));
          resolve();
        }, 1000);
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update assessment', loading: false });
    }
  },

  submitDoctorReview: async (assessmentId: string, review) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          set(state => ({
            assessments: state.assessments.map(assessment =>
              assessment.id === assessmentId
                ? {
                    ...assessment,
                    status: review.status,
                    details: {
                      ...assessment.details,
                      doctorNotes: review.doctorNotes,
                      recommendations: review.recommendations,
                      followUpDate: review.followUpDate,
                      reviewDate: new Date().toISOString()
                    }
                  }
                : assessment
            ),
            loading: false
          }));
          resolve();
        }, 1000);
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to submit review', loading: false });
    }
  },

  submitPredictionReview: async (predictionId: string, doctorReview) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          set(state => ({
            predictions: state.predictions.map(prediction =>
              prediction.id === predictionId
                ? {
                    ...prediction,
                    doctor_review: {
                      ...doctorReview,
                      review_date: new Date().toISOString()
                    },
                    reviewed_at: new Date().toISOString(),
                    next_assessment_date: doctorReview.follow_up_date
                  }
                : prediction
            ),
            loading: false
          }));
          resolve();
        }, 1000);
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to submit prediction review', loading: false });
    }
  }
})); 