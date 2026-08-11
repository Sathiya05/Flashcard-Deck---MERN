import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// User Pages
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import CreateCard from './pages/CreateCard';
import EditCard from './pages/EditCard';
import Notifications from './pages/Notifications';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCardReview from './pages/AdminCardReview';

// Components
import Navbar from './components/Navbar';
import './App.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" />;
  if (!adminOnly && isAdmin) return <Navigate to="/admin/dashboard" />;
  
  return children;
};

const PublicRouteInner = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  if (isAuthenticated && !isAdmin) return <Navigate to="/dashboard" />;
  
  return children;
};

const AdminPublicRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  if (isAdmin) return <Navigate to="/admin/dashboard" />;
  
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  if (!isAdmin) return <Navigate to="/admin/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<PublicRouteInner><Login /></PublicRouteInner>} />
              <Route path="/register" element={<PublicRouteInner><Register /></PublicRouteInner>} />
              
              {/* User Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/cards/create" element={<ProtectedRoute><CreateCard /></ProtectedRoute>} />
              <Route path="/cards/:id/edit" element={<ProtectedRoute><EditCard /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminPublicRoute><AdminLogin /></AdminPublicRoute>} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/cards/:id" element={<AdminProtectedRoute><AdminCardReview /></AdminProtectedRoute>} />
              
              {/* Default */}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
