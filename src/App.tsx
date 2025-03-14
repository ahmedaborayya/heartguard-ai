import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/layout/Layout';
import RequireAuth from './components/auth/RequireAuth';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PredictionForm from './components/PredictionForm';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import DoctorPage from './pages/DoctorPage';
import PatientDetail from './components/doctor/PatientDetail';
import DoctorRoute from './components/doctor/DoctorRoute';
import { useAuthStore } from './stores/authStore';

const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  React.useEffect(() => {
    // Initialize auth check
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/doctor" element={<DoctorPage />} />
            <Route 
              path="/patient/:patientId" 
              element={
                <RequireAuth>
                  <DoctorRoute>
                    <PatientDetail />
                  </DoctorRoute>
                </RequireAuth>
              } 
            />
            <Route
              path="/predict"
              element={
                <RequireAuth>
                  <PredictionForm />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;