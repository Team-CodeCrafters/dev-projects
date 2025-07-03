import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingPage from './pages/LoadingPage';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
import DashboardLayout from './components/layout/DashboardLayout';
import UserProfile from './pages/UserProfile';
import { useTheme } from './hooks/useTheme';

function App() {
  const { setCurrentTheme } = useTheme();
  useEffect(() => {
    setCurrentTheme();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/projects" element={<div />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Route>

          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
