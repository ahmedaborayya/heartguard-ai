export type FormData = {
  heartDisease: 'Yes' | 'No';
  bmi: number;
  smoking: 'Yes' | 'No';
  alcoholDrinking: 'Yes' | 'No';
  stroke: 'Yes' | 'No';
  physicalHealth: number;
  mentalHealth: number;
  diffWalking: 'Yes' | 'No';
  sex: 'Male' | 'Female';
  ageCategory: string;
  race: string;
  diabetic: 'Yes' | 'No';
  physicalActivity: 'Yes' | 'No';
  genHealth: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  sleepTime: number;
  asthma: 'Yes' | 'No';
  kidneyDisease: 'Yes' | 'No';
  skinCancer: 'Yes' | 'No';
};

export type ExtendedProfile = {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  gender: 'Male' | 'Female' | 'Other' | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
};

export type Prediction = {
  id: string;
  user_id: string;
  prediction_result: boolean;
  prediction_date: string;
  bmi: number;
  smoking: boolean;
  alcohol_drinking: boolean;
  stroke: boolean;
  physical_health: number;
  mental_health: number;
  diff_walking: boolean;
  sex: string;
  age_category: string;
  race: string;
  diabetic: boolean;
  physical_activity: boolean;
  gen_health: string;
  sleep_time: number;
  asthma: boolean;
  kidney_disease: boolean;
  skin_cancer: boolean;
  // Doctor's response fields
  doctor_review?: {
    doctor_id: string;
    doctor_name: string;
    review_date: string;
    notes: string;
    recommendations: string[];
    prescribed_medications?: string[];
    follow_up_date?: string;
    status: 'pending' | 'reviewed' | 'needs_followup';
    risk_level: 'low' | 'medium' | 'high';
    action_items: string[];
  };
  // Additional tracking fields
  reviewed_at?: string;
  next_assessment_date?: string;
  critical_findings?: string[];
  lifestyle_recommendations?: string[];
};

export type RiskTrend = 'increasing' | 'decreasing' | 'stable';

export type RiskFactor = {
  name: string;
  level: 'low' | 'medium' | 'high';
  value: string | number;
  recommendation: string;
  trend: RiskTrend;
  score: number; // 0-100 score for this factor
  details?: string[]; // Additional details or bullet points
  previousValue?: string | number; // For historical comparison
};

export type HealthScore = {
  overall: number;
  breakdown: {
    lifestyle: number;
    medical: number;
    biometric: number;
  };
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
};

export const AGE_CATEGORIES = [
  '18-24', '25-29', '30-34', '35-39', '40-44', '45-49',
  '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'
];

export const RACE_CATEGORIES = [
  'White', 'Black', 'Asian', 'Hispanic', 'American Indian/Alaskan Native',
  'Other'
];

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  // Doctor specific fields
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: string;
  clinicAddress?: string;
}

export interface HealthMetric {
  label: string;
  value: string | number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

export interface Assessment {
  id: string;
  date: string;
  patientId: string;
  doctorId?: string;
  riskScore: number;
  status: 'pending' | 'reviewed' | 'needs_revision';
  symptoms: string[];
  notes: string;
  details: {
    // Patient Inputs
    age: number;
    gender: string;
    bloodPressure: string;
    heartRate: number;
    cholesterol: number;
    bloodSugar: number;
    fastingBloodSugar: number;
    restingECG: string;
    maxHeartRate: number;
    exerciseAngina: boolean;
    oldpeak: number;
    chestPainType: string;
    // Form Data
    bmi: number;
    smoking: boolean;
    alcoholDrinking: boolean;
    stroke: boolean;
    physicalHealth: number;
    mentalHealth: number;
    diffWalking: boolean;
    diabetic: boolean;
    physicalActivity: boolean;
    genHealth: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
    sleepTime: number;
    asthma: boolean;
    kidneyDisease: boolean;
    skinCancer: boolean;
    // Current Treatment
    medications: string[];
    // Doctor's Feedback
    recommendations: string;
    doctorNotes?: string;
    reviewDate?: string;
    followUpDate?: string;
    // Risk Analysis
    riskFactors: RiskFactor[];
    healthScore: HealthScore;
  };
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  phoneNumber: string;
  lastAssessment?: string;
  nextCheckup?: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  doctorId?: string;
}

export interface DoctorStats {
  totalPatients: number;
  highRiskPatients: number;
  assessmentsToday: number;
  pendingReviews: number;
}

export interface Notification {
  id: string;
  type: 'assessment' | 'review' | 'appointment' | 'system';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  data?: {
    assessmentId?: string;
    patientId?: string;
    appointmentId?: string;
  };
}

export interface PatientHealthSummary {
  currentAssessment?: Assessment;
  previousAssessment?: Assessment;
  riskTrend: RiskTrend;
  criticalMetrics: HealthMetric[];
  upcomingAppointments: {
    date: string;
    type: 'checkup' | 'follow_up' | 'specialist';
    doctorName: string;
  }[];
  medicationSchedule: {
    medication: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
  }[];
}

export interface DoctorDashboardData {
  stats: DoctorStats;
  upcomingAppointments: {
    id: string;
    patientName: string;
    patientId: string;
    date: string;
    type: 'checkup' | 'follow_up' | 'specialist';
    notes?: string;
  }[];
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  recentActivity: {
    id: string;
    type: 'assessment_review' | 'appointment' | 'patient_update';
    description: string;
    date: string;
    relatedId?: string;
  }[];
}