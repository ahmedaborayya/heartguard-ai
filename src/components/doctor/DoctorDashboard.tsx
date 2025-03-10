import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Container,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { Patient, Assessment } from '../../types';

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { assessments, loading, error, fetchDoctorAssessments } = useAssessmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchDoctorAssessments(user.id);
    }
  }, [user?.id, fetchDoctorAssessments]);

  const patients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      phoneNumber: '+1234567890',
      email: 'john@example.com',
      riskLevel: 'high',
      doctorId: user?.id || '',
    },
    // ... Add more mock patients as needed
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter.length === 0 || riskFilter.includes(patient.riskLevel);
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
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

  const stats = {
    totalPatients: patients.length,
    highRiskPatients: patients.filter(p => p.riskLevel === 'high').length,
    pendingAssessments: assessments.filter(a => !a.doctorReview).length,
    completedAssessments: assessments.filter(a => a.doctorReview).length,
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Doctor Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="h5">{stats.totalPatients}</Typography>
                    <Typography color="textSecondary">Total Patients</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <WarningIcon color="error" />
                  <Box>
                    <Typography variant="h5">{stats.highRiskPatients}</Typography>
                    <Typography color="textSecondary">High Risk Patients</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AssessmentIcon color="warning" />
                  <Box>
                    <Typography variant="h5">{stats.pendingAssessments}</Typography>
                    <Typography color="textSecondary">Pending Reviews</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TrendingUpIcon color="success" />
                  <Box>
                    <Typography variant="h5">{stats.completedAssessments}</Typography>
                    <Typography color="textSecondary">Completed Reviews</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant={riskFilter.includes('high') ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => setRiskFilter(prev => 
                    prev.includes('high') 
                      ? prev.filter(r => r !== 'high')
                      : [...prev, 'high']
                  )}
                >
                  High Risk
                </Button>
                <Button
                  variant={riskFilter.includes('medium') ? 'contained' : 'outlined'}
                  color="warning"
                  onClick={() => setRiskFilter(prev => 
                    prev.includes('medium') 
                      ? prev.filter(r => r !== 'medium')
                      : [...prev, 'medium']
                  )}
                >
                  Medium Risk
                </Button>
                <Button
                  variant={riskFilter.includes('low') ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => setRiskFilter(prev => 
                    prev.includes('low') 
                      ? prev.filter(r => r !== 'low')
                      : [...prev, 'low']
                  )}
                >
                  Low Risk
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Patient List */}
        <Grid container spacing={3}>
          {filteredPatients.map((patient) => (
            <Grid item xs={12} md={6} lg={4} key={patient.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar>
                      {patient.name.charAt(0)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6">{patient.name}</Typography>
                      <Typography color="textSecondary">
                        {patient.age} years • {patient.gender}
                      </Typography>
                    </Box>
                    <Chip
                      label={patient.riskLevel.toUpperCase()}
                      color={getRiskColor(patient.riskLevel) as any}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body2" paragraph>
                    Email: {patient.email}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Phone: {patient.phoneNumber}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/patient/${patient.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default DoctorDashboard;