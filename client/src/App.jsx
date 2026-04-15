import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Connexion from './pages/Connexion';
import TableauBordPorteur from './pages/TableauBordPorteur';
import TableauBordAdmin from './pages/TableauBordAdmin';
import Calendrier from './composants/Calendrier';
import SuiviEtapes from './composants/SuiviEtapes';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Chargement...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Connexion onLogin={handleLogin} />} />
      
      <Route path="/" element={user ? (
        user.role === 'admin' ? 
          <TableauBordAdmin user={user} onLogout={handleLogout} /> : 
          <TableauBordPorteur user={user} onLogout={handleLogout} />
      ) : <Navigate to="/login" />} />
      
      <Route path="/calendrier" element={user ? <Calendrier /> : <Navigate to="/login" />} />
      
      <Route path="/etapes" element={user ? <SuiviEtapes /> : <Navigate to="/login" />} />
      
      {/* Redirection pour les routes inexistantes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;