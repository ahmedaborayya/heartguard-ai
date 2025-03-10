import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import predictionService, {
  Prediction,
  PredictionResponse,
  HealthMetrics,
  DoctorReview
} from '../services/predictionService';

interface PredictionState {
  predictions: Prediction[];
  currentPrediction: PredictionResponse | null;
  loading: boolean;
  error: string | null;
  // Actions
  createPrediction: (data: HealthMetrics) => Promise<void>;
  fetchUserPredictions: () => Promise<void>;
  fetchPrediction: (id: string) => Promise<void>;
  createReview: (predictionId: string, review: DoctorReview) => Promise<void>;
  updateReview: (predictionId: string, review: DoctorReview) => Promise<void>;
  fetchDoctorReviews: () => Promise<void>;
  clearCurrentPrediction: () => void;
  clearError: () => void;
}

const usePredictionStore = create<PredictionState>()(
  devtools(
    (set, get) => ({
      predictions: [],
      currentPrediction: null,
      loading: false,
      error: null,

      createPrediction: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await predictionService.createPrediction(data);
          set({
            currentPrediction: response,
            predictions: [response.prediction, ...get().predictions],
            loading: false
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to create prediction',
            loading: false
          });
          throw error;
        }
      },

      fetchUserPredictions: async () => {
        set({ loading: true, error: null });
        try {
          const predictions = await predictionService.getUserPredictions();
          set({ predictions, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to fetch predictions',
            loading: false
          });
          throw error;
        }
      },

      fetchPrediction: async (id) => {
        set({ loading: true, error: null });
        try {
          const prediction = await predictionService.getPrediction(id);
          set({
            currentPrediction: {
              prediction,
              risk_factors: [], // These would come from the backend
              recommendations: prediction.lifestyle_recommendations || []
            },
            loading: false
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to fetch prediction',
            loading: false
          });
          throw error;
        }
      },

      createReview: async (predictionId, review) => {
        set({ loading: true, error: null });
        try {
          const doctorReview = await predictionService.createReview(predictionId, review);
          const predictions = get().predictions.map(p =>
            p.id === predictionId ? { ...p, doctor_review: doctorReview } : p
          );
          set({ predictions, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to create review',
            loading: false
          });
          throw error;
        }
      },

      updateReview: async (predictionId, review) => {
        set({ loading: true, error: null });
        try {
          const doctorReview = await predictionService.updateReview(predictionId, review);
          const predictions = get().predictions.map(p =>
            p.id === predictionId ? { ...p, doctor_review: doctorReview } : p
          );
          set({ predictions, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to update review',
            loading: false
          });
          throw error;
        }
      },

      fetchDoctorReviews: async () => {
        set({ loading: true, error: null });
        try {
          const reviews = await predictionService.getDoctorReviews();
          // You might want to store these separately or handle them differently
          set({ loading: false });
          return reviews;
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to fetch reviews',
            loading: false
          });
          throw error;
        }
      },

      clearCurrentPrediction: () => {
        set({ currentPrediction: null });
      },

      clearError: () => {
        set({ error: null });
      }
    })
  )
);

export default usePredictionStore;