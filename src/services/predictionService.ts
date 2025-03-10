import apiClient from './api';

export interface HealthMetrics {
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
}

export interface DoctorReview {
  notes: string;
  recommendations: string[];
  prescribed_medications?: string[];
  follow_up_date?: string;
  status: 'pending' | 'reviewed' | 'needs_followup';
  risk_level: 'low' | 'medium' | 'high';
  action_items: string[];
}

export interface Prediction extends HealthMetrics {
  id: string;
  user_id: string;
  prediction_result: boolean;
  prediction_date: string;
  reviewed_at?: string;
  next_assessment_date?: string;
  critical_findings?: string[];
  lifestyle_recommendations?: string[];
  doctor_review?: DoctorReview;
  created_at: string;
  updated_at: string;
}

export interface PredictionResponse {
  prediction: Prediction;
  risk_factors: Array<{
    name: string;
    level: 'low' | 'medium' | 'high';
    value: any;
    description: string;
  }>;
  recommendations: string[];
}

const predictionService = {
  async createPrediction(data: HealthMetrics): Promise<PredictionResponse> {
    const response = await apiClient.post<PredictionResponse>('/predictions/predict', data);
    return response.data;
  },

  async getUserPredictions(skip = 0, limit = 100): Promise<Prediction[]> {
    const response = await apiClient.get<Prediction[]>('/predictions/me', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getPrediction(id: string): Promise<Prediction> {
    const response = await apiClient.get<Prediction>(`/predictions/${id}`);
    return response.data;
  },

  async createReview(predictionId: string, review: DoctorReview): Promise<DoctorReview> {
    const response = await apiClient.post<DoctorReview>(
      `/predictions/${predictionId}/review`,
      review
    );
    return response.data;
  },

  async updateReview(predictionId: string, review: DoctorReview): Promise<DoctorReview> {
    const response = await apiClient.put<DoctorReview>(
      `/predictions/${predictionId}/review`,
      review
    );
    return response.data;
  },

  async getDoctorReviews(skip = 0, limit = 100): Promise<DoctorReview[]> {
    const response = await apiClient.get<DoctorReview[]>('/predictions/doctor/reviews', {
      params: { skip, limit },
    });
    return response.data;
  },
};

export default predictionService;