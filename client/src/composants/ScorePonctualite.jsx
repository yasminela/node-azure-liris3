import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { iconColors } from '../styles/iconColors';

function ScorePonctualite() {
  const [score, setScore] = useState(null);
  const [niveau, setNiveau] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScore();
  }, []);

  const loadScore = async () => {
    try {
      const res = await api.get('/soumissions/score-ponctualite');
      setScore(res.data.score);
      setNiveau(res.data.niveau);
    } catch (error) {
      console.error('Erreur chargement score:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getIcone = () => {
    if (score >= 80) return faCheckCircle;
    if (score >= 60) return faChartLine;
    return faExclamationTriangle;
  };

  if (loading) return null;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 16px',
      background: getScoreColor() + '10',
      borderRadius: '20px',
      border: `1px solid ${getScoreColor()}30`
    }}>
      <FontAwesomeIcon icon={getIcone()} color={getScoreColor()} />
      <div>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Score de ponctualité</span>
        <div>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: getScoreColor() }}>{score}</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>/100</span>
          <span style={{ fontSize: '11px', marginLeft: '8px', color: getScoreColor() }}>({niveau})</span>
        </div>
      </div>
    </div>
  );
}

export default ScorePonctualite;