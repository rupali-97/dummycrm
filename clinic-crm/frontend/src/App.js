import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import Billing from './pages/Billing';
import Reports from './pages/Reports';

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
        <Route path="doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
        <Route path="appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
        <Route path="billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
