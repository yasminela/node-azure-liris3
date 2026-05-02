import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUser, faEnvelope, faPercent, faTrophy } from '@fortawesome/free-solid-svg-icons';

function ScoresPorteurs() {
  const { darkMode } = useTheme();
  const [porteurs, setPorteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    moyenne: 0,
    excellent: 0,
    bon: 0,
    aAmeliorer: 0
  });

  useEffect(() => {
    loadPorteurs();
  }, []);

  const loadPorteurs = async () => {
    try {
      const res = await api.get('/utilisateurs');
      const porteursList = res.data.filter(u => u.role === 'porteur');
      setPorteurs(porteursList);
      
      // Calculer les stats
      const scores = porteursList.map(p => p.scoreCompletions || 0);
      const moyenne = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      
      setStats({
        total: porteursList.length,
        moyenne: moyenne,
        excellent: porteursList.filter(p => (p.scoreCompletions || 0) >= 70).length,
        bon: porteursList.filter(p => (p.scoreCompletions || 0) >= 40 && (p.scoreCompletions || 0) < 70).length,
        aAmeliorer: porteursList.filter(p => (p.scoreCompletions || 0) < 40).length
      });
    } catch (error) {
      console.error('Erreur chargement porteurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLevel = (score) => {
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Bon';
    return 'À améliorer';
  };

  const styles = {
    container: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: darkMode ? '#ffffff' : '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderLeft: '4px solid #667eea',
      paddingLeft: '16px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    statCard: {
      background: darkMode ? '#0f172a' : '#f8fafc',
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'center',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    statValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: darkMode ? '#ffffff' : '#1e293b'
    },
    statLabel: {
      fontSize: '13px',
      color: darkMode ? '#cbd5e1' : '#64748b',
      marginTop: '8px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      background: darkMode ? '#334155' : '#f1f5f9',
      color: darkMode ? '#e2e8f0' : '#475569',
      fontWeight: '600',
      fontSize: '13px',
      borderBottom: `2px solid ${darkMode ? '#475569' : '#e2e8f0'}`
    },
    td: {
      padding: '12px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      fontSize: '14px',
      color: darkMode ? '#cbd5e1' : '#475569'
    },
    badge: (score) => ({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      background: getScoreColor(score) + '20',
      color: getScoreColor(score)
    }),
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: darkMode ? '#94a3b8' : '#64748b'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>Chargement des scores...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <FontAwesomeIcon icon={faTrophy} color="#667eea" />
        Scores de complétion des porteurs
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Porteurs</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.excellent}</div>
          <div style={styles.statLabel}>Score Excellent (≥70%)</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.bon}</div>
          <div style={styles.statLabel}>Score Bon (40-69%)</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.aAmeliorer}</div>
          <div style={styles.statLabel}>À améliorer ({'<40%'})</div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Porteur</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Niveau</th>
            </tr>
          </thead>
          <tbody>
            {porteurs.map(p => (
              <tr key={p._id}>
                <td style={styles.td}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', color: '#667eea' }} />
                  {p.firstName} {p.lastName}
                </td>
                <td style={styles.td}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', color: '#667eea' }} />
                  {p.email}
                </td>
                <td style={styles.td}>
                  <span style={styles.badge(p.scoreCompletions || 0)}>
                    {(p.scoreCompletions || 0)}%
                  </span>
                </td>
                <td style={styles.td}>{getScoreLevel(p.scoreCompletions || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScoresPorteurs;