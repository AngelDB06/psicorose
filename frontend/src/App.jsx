import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import PostDetailPage from './pages/PostDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBlogPage from './pages/AdminBlogPage';
import FloatingChat from './components/chat/FloatingChat';
import { AuthProvider, useAuth } from './context/AuthContext';

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente para proteger rutas de administrador
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-primary-200">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre-rosa" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<PostDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reservar" 
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/blog" 
              element={
                <AdminRoute>
                  <AdminBlogPage />
                </AdminRoute>
              } 
            />
          </Routes>
          <FloatingChat />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
