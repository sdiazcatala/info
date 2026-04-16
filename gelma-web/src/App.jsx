import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Reports from './pages/Reports';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail'; // Nueva página de verificación
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Rutas Protegidas */}
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'EDITOR', 'VIEWER']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'EDITOR', 'VIEWER']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/clients" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'EDITOR']}>
            <Clients />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'EDITOR']}>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'EDITOR']}>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'EDITOR', 'VIEWER']}>
            <Reports />
          </ProtectedRoute>
        } />

        {/* Redirección de rutas desconocidas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;