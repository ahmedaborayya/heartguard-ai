import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Chip,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { ChevronDown, ChevronUp, FileText, AlertCircle } from 'lucide-react';
import usePredictionStore from '../../stores/predictionStore';
import { DoctorReview } from '../../services/predictionService';

const PatientDetail = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [expandedAssessment, setExpandedAssessment] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState<Partial<DoctorReview>>({
    notes: '',
    recommendations: [],
    status: 'pending',
    risk_level: 'low',
    action_items: [],
  });

  const {
    predictions,
    loading,
    error,
    fetchUserPredictions,
    createReview,
    clearError
  } = usePredictionStore();

  useEffect(() => {
    if (patientId) {
      fetchUserPredictions();
    }
  }, [patientId]);

  const handleExpandAssessment = (id: string) => {
    setExpandedAssessment(expandedAssessment === id ? null : id);
  };

  const handleOpenReviewDialog = (predictionId: string) => {
    setSelectedPredictionId(predictionId);
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setSelectedPredictionId(null);
    setReviewDialogOpen(false);
    setReviewForm({
      notes: '',
      recommendations: [],
      status: 'pending',
      risk_level: 'low',
      action_items: [],
    });
  };

  const handleSubmitReview = async () => {
    if (!selectedPredictionId || !reviewForm.notes) return;

    try {
      await createReview(selectedPredictionId, reviewForm as DoctorReview);
      handleCloseReviewDialog();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={clearError}>
        {error}
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Patient Assessments
      </Typography>

      {predictions.map((prediction) => (
        <Card key={prediction.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => handleExpandAssessment(prediction.id)}
              sx={{ cursor: 'pointer' }}
            >
              <Box>
                <Typography variant="h6">
                  Assessment Date: {new Date(prediction.prediction_date).toLocaleDateString()}
                </Typography>
                <Chip
                  label={prediction.prediction_result ? 'High Risk' : 'Low Risk'}
                  color={prediction.prediction_result ? 'error' : 'success'}
                  sx={{ mt: 1 }}
                />
              </Box>
              {expandedAssessment === prediction.id ? <ChevronUp /> : <ChevronDown />}
            </Box>

            {expandedAssessment === prediction.id && (
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Health Metrics
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography>BMI: {prediction.bmi}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          Physical Health: {prediction.physical_health}/30
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          Mental Health: {prediction.mental_health}/30
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          Sleep Time: {prediction.sleep_time} hours
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Risk Factors
                    </Typography>
                    <Grid container spacing={1}>
                      {prediction.critical_findings?.map((finding, index) => (
                        <Grid item xs={12} key={index}>
                          <Typography>
                            <AlertCircle size={16} style={{ marginRight: 8 }} />
                            {finding}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  {prediction.doctor_review ? (
                    <Grid item xs={12}>
                      <Box mt={2}>
                        <Typography variant="h6" gutterBottom>
                          Doctor's Review
                        </Typography>
                        <Chip
                          label={prediction.doctor_review.risk_level}
                          color={getRiskLevelColor(prediction.doctor_review.risk_level)}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body1" gutterBottom>
                          {prediction.doctor_review.notes}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Recommendations:
                        </Typography>
                        <ul>
                          {prediction.doctor_review.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </Box>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Box mt={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<FileText />}
                          onClick={() => handleOpenReviewDialog(prediction.id)}
                        >
                          Add Review
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      <Dialog open={reviewDialogOpen} onClose={handleCloseReviewDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add Doctor's Review</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes"
              value={reviewForm.notes}
              onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Recommendations"
              placeholder="Enter recommendations (comma-separated)"
              value={reviewForm.recommendations?.join(', ')}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  recommendations: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Action Items"
              placeholder="Enter action items (comma-separated)"
              value={reviewForm.action_items?.join(', ')}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  action_items: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Risk Level"
              value={reviewForm.risk_level}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, risk_level: e.target.value as any })
              }
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained" color="primary">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDetail;