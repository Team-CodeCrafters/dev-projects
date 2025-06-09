import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingPage from './pages/LoadingPage';
const Login = lazy(() => import('./pages/Login'));
import DashboardLayout from './components/DashboardLayout';
import UserProfile from './components/UserProfile';
import { useTheme } from './hooks/useTheme';
const Dashboard = lazy(() => import('./pages/Dashboard'));
function App() {
  const { setCurrentTheme } = useTheme();
  setCurrentTheme();
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/projects" element={<div />} />
          </Route>
          <Route path="*" element={<div>Page not Found</div>}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
