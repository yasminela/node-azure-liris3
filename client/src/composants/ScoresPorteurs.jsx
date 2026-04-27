import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faUser, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { iconColors } from '../styles/iconColors';

function ScoresPorteurs() {
  const [porteurs, setPorteurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const res = await api.get('/profil/tous-scores');
      setPorteurs(res.data);
    } catch (error) {
      console.error('Erreur chargement scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getMedaille = (index) => {
    if (index === 0) return <FontAwesomeIcon icon={faTrophy} color="#f59e0b" />;
    if (index === 1) return <FontAwesomeIcon icon={faMedal} color="#94a3b8" />;
    if (index === 2) return <FontAwesomeIcon icon={faMedal} color="#cd7f32" />;
    return null;
  };

  const styles = {
    container: {
      background: iconColors.white,
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: iconColors.black,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderLeft: `4px solid ${iconColors.primary}`,
      paddingLeft: '16px'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    },
    statCard: {
      background: '#f8fafc',
      borderRadius: '16px',
      padding: '16px'
    },
    statNumber: { fontSize: '28px', fontWeight: 'bold', color: iconColors.primary },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px', textAlign: 'left', background: iconColors.grayBg, borderBottom: '2px solid #e2e8f0' },
    td: { padding: '12px', borderBottom: '1px solid #e2e8f0' },
    badge: (score) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      background: getScoreColor(score) + '20',
      color: getScoreColor(score)
    })
  };

  if (loading) return <div style={styles.container}>Chargement des scores...</div>;

  const stats = {
    complet: porteurs.filter(p => p.score >= 80).length,
    moyen: porteurs.filter(p => p.score >= 50 && p.score < 80).length,
    faible: porteurs.filter(p => p.score < 50).length,
    moyenne: porteurs.length > 0 ? Math.round(porteurs.reduce((a, b) => a + b.score, 0) / porteurs.length) : 0
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <FontAwesomeIcon icon={faChartLine} color={iconColors.primary} />
        Scores de complétion des porteurs
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.complet}</div>
          <div>Profil complet (≥80%)</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.moyen}</div>
          <div>Profil en progression (50-79%)</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.faible}</div>
          <div>Profil à compléter (&lt;50%)</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.moyenne}%</div>
          <div>Score moyen global</div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Porteur</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Niveau</th>
            </tr>
          </thead>
          <tbody>
            {porteurs.map((porteur, index) => (
              <tr key={porteur.id}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getMedaille(index)}
                    <span>{index + 1}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <strong>{porteur.firstName} {porteur.lastName}</strong>
                  {porteur.nomProjet && <div style={{ fontSize: '11px', color: '#64748b' }}>Projet: {porteur.nomProjet}</div>}
                </td>
                <td style={styles.td}>{porteur.email}</td>
                <td style={styles.td}>
                  <span style={styles.badge(porteur.score)}>{porteur.score}%</span>
                </td>
                <td style={styles.td}>
                  {porteur.score >= 80 ? '✅ Excellent' : porteur.score >= 50 ? '📊 En progression' : '⚠️ À compléter'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScoresPorteurs;