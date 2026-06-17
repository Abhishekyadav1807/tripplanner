import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import History from './pages/History';
import ItineraryDetails from './pages/ItineraryDetails';
import SharedItinerary from './pages/SharedItinerary';
import api from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    
    const storedUser = localStorage.getItem('trip_user');
    const token = localStorage.getItem('trip_token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        
        
        api.auth.getMe()
          .then(res => {
            if (res.success) {
              const freshUser = res.data;
              setUser(freshUser);
              localStorage.setItem('trip_user', JSON.stringify(freshUser));
            }
          })
          .catch(() => {
            
            
            handleLogout();
          });
      } catch (err) {
        console.error('Failed to parse stored user session:', err);
        handleLogout();
      }
    }
    setAuthChecking(false);
  }, []);

  const handleLoginSuccess = (data) => {
    setUser({ username: data.username, email: data.email });
    localStorage.setItem('trip_token', data.token);
    localStorage.setItem('trip_user', JSON.stringify({ username: data.username, email: data.email }));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('trip_token');
    localStorage.removeItem('trip_user');
  };

  if (authChecking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <span className="loader loader-lg"></span>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)' }}>
        {}
        <Navbar user={user} onLogout={handleLogout} />
        
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Auth Routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" replace /> : <Register onLoginSuccess={handleLoginSuccess} />} 
            />

            {}
            <Route path="/shared/:shareId" element={<SharedItinerary />} />

            {/* Protected Core Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/itinerary/:id" 
              element={
                <ProtectedRoute>
                  <ItineraryDetails />
                </ProtectedRoute>
              } 
            />

            {}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
