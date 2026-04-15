import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from './Icon';

function MesProjets() {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjets();
  }, []);

  const loadProjets = async () => {
    try {
      const res = await api.get('/projets/mes-projets');
      setProjets(res.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: { 
        icon: 'pending', 
        color: '#f59e0b', 
        bg: '#fef3c7', 
        text: 'En attente' 
      },
      valide: { 
        icon: 'check_st', 
        color: '#059669', 
        bg: '#d1fae5', 
        text: 'Validé' 
      },
      rejete: { 
        icon: 'exclamation_point', 
        color: '#dc2626', 
        bg: '#fee2e2', 
        text: 'Rejeté' 
      }
    };
    const b = badges[statut] || { 
      icon: 'info', 
      color: '#374151', 
      bg: '#f3f4f6', 
      text: statut 
    };
    return (
      <span style={{ 
        background: b.bg, 
        color: b.color, 
        padding: '4px 10px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '6px' 
      }}>
        <Icon name={b.icon} size={12} color={b.color} />
        {b.text}
      </span>
    );
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    title: {
      marginBottom: '15px',
      color: '#667eea',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '18px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      overflowX: 'auto'
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      background: '#667eea',
      color: 'white',
      fontWeight: 'bold'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #eee'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#666'
    },
    projetHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>
      <Icon name="pending" size={24} color="#667eea" />
      <p>Chargement...</p>
    </div>;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        <Icon name="folder_open" size={22} color="#667eea" />
        Mes projets
      </h3>

      {projets.length === 0 ? (
        <div style={styles.emptyState}>
          <Icon name="no_notification" size={48} color="#ccc" />
          <p> Aucun projet pour le moment</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Projet</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>Date début</th>
              </tr>
            </thead>
            <tbody>
              {projets.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={styles.td}>
                    <div style={styles.projetHeader}>
                      <Icon name="business" size={16} color="#667eea" />
                      <strong>{p.titre || p.nomProjet}</strong>
                    </div>
                  </td>
                  <td style={styles.td}>{p.description || '—'}</td>
                  <td style={styles.td}>{getStatutBadge(p.statut)}</td>
                  <td style={styles.td}>
                    {new Date(p.dateDebut).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MesProjets;