import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import SplashScreen from './components/SplashScreen';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerPassport from './pages/worker/WorkerPassport';
import FindWork from './pages/worker/FindWork';
import MyApplications from './pages/worker/MyApplications';
import GovtDashboard from './pages/government/GovtDashboard';
import SkillGap from './pages/government/SkillGap';
import EmploymentOutcomes from './pages/government/EmploymentOutcomes';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetail from './pages/projects/ProjectDetail';
import TrainingPage from './pages/training/TrainingPage';
import AppLayout from './components/AppLayout';
import { useState } from 'react';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Initial authentication loading is handled by the single startup splash.
  // Never show a second full-screen loading/splash UI here.
  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected - Worker */}
      <Route path="/worker" element={
        <ProtectedRoute roles={['WORKER']}>
          <AppLayout><WorkerDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/passport" element={
        <ProtectedRoute roles={['WORKER']}>
          <AppLayout><WorkerPassport /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/find-work" element={
        <ProtectedRoute roles={['WORKER']}>
          <AppLayout><FindWork /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-applications" element={
        <ProtectedRoute roles={['WORKER']}>
          <AppLayout><MyApplications /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Protected - Government */}
      <Route path="/government" element={
        <ProtectedRoute roles={['GOVERNMENT', 'ADMIN']}>
          <AppLayout><GovtDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/skill-gap" element={
        <ProtectedRoute roles={['GOVERNMENT', 'ADMIN']}>
          <AppLayout><SkillGap /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/employment-outcomes" element={
        <ProtectedRoute roles={['GOVERNMENT', 'ADMIN']}>
          <AppLayout><EmploymentOutcomes /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Protected - Shared (all authenticated roles) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout><DashboardPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute>
          <AppLayout><ProjectsPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/projects/:id" element={
        <ProtectedRoute>
          <AppLayout><ProjectDetail /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/training" element={
        <ProtectedRoute>
          <AppLayout><TrainingPage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function StartupGate() {
  const { isLoading } = useAuth();
  const [splashComplete, setSplashComplete] = useState(false);

  // The branded splash is the ONLY startup screen.
  // Keep it visible until both its minimum display time and auth bootstrap
  // are complete, so a second spinner can never flash after it.
  return (
    <>
      {!splashComplete || isLoading ? (
        <SplashScreen onComplete={() => setSplashComplete(true)} />
      ) : (
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <StartupGate />
      </ToastProvider>
    </AuthProvider>
  );
}
