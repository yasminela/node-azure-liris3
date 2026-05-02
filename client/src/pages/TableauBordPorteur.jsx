import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../composants/Navbar';
import Calendrier from '../composants/Calendrier';
import SuiviEtapes from '../composants/SuiviEtapes';
import CreerProjet from '../composants/CreerProjet';
import Icon from '../composants/Icon';
import PiedDePage from '../composants/PiedDePage';
import AvatarManager from '../composants/AvatarManager';
import GestionAnalysesIA from '../composants/GestionAnalysesIA';

function TableauBordPorteur({ user, onLogout }) {
  const { darkMode } = useTheme();
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [showCreerProjet, setShowCreerProjet] = useState(false);
  const [stats, setStats] = useState({ projetsCount: 0, tachesCount: 0, etapesCount: 0, progression: 0 });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    loadData();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const res = await api.get('/utilisateurs/me');
      setCurrentUser(res.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [projetsRes, tachesRes, etapesRes] = await Promise.all([
        api.get('/projets/mes-projets'),
        api.get('/taches/mes-taches'),
        api.get('/etapes/mes-etapes')
      ]);
      setProjets(projetsRes.data || []);
      setTaches(tachesRes.data || []);

      const etapes = etapesRes.data || [];
      const etapesRestantes = etapes.filter(e => e.statut !== 'validee').length;
      const totalEtapes = etapes.length || 1;
      const progression = Math.round(((totalEtapes - etapesRestantes) / totalEtapes) * 100);

      setStats({
        projetsCount: projetsRes.data?.length || 0,
        tachesCount: tachesRes.data?.filter(t => !t.estComplete).length || 0,
        etapesCount: etapesRestantes,
        progression: progression
      });
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: { color: '#f59e0b', bg: '#fef3c7', text: 'En attente', icon: 'pending' },
      valide: { color: '#10b981', bg: '#d1fae5', text: 'Validé', icon: 'check' },
      rejete: { color: '#ef4444', bg: '#fee2e2', text: 'Rejeté', icon: 'exclamation' }
    };
    const b = badges[statut] || badges.en_attente;
    return (
      <span style={{ background: b.bg, color: b.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <Icon name={b.icon} size={12} color={b.color} />
        {b.text}
      </span>
    );
  };

  const styles = {
    container: { padding: 'clamp(16px, 4vw, 24px)', maxWidth: '1200px', margin: '0 auto' },
    headerCard: { 
      background: darkMode ? '#1e293b' : 'white', 
      borderRadius: '20px', 
      padding: '24px', 
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px'
    },
    userInfo: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
    userName: { 
      fontSize: 'clamp(20px, 5vw, 24px)', 
      fontWeight: 'bold', 
      color: darkMode ? '#ffffff' : '#1e293b',  // ← BLANC en mode sombre
      marginBottom: '4px' 
    },
    userEmail: { 
      color: darkMode ? '#cbd5e1' : '#64748b',   // ← GRIS CLAIR en mode sombre
      fontSize: '13px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px' 
    },
    userRole: { 
      marginTop: '8px',
      background: darkMode ? '#334155' : '#667eea20', 
      color: darkMode ? '#a5b4fc' : '#667eea', 
      padding: '4px 12px', 
      borderRadius: '20px', 
      fontSize: '11px',
      display: 'inline-block'
    },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' },
    statCard: {
      background: darkMode ? '#1e293b' : 'white',
      padding: '20px',
      borderRadius: '16px',
      textAlign: 'center',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    statValue: { 
      fontSize: 'clamp(28px, 5vw, 36px)', 
      fontWeight: 'bold', 
      color: darkMode ? '#ffffff' : '#1e293b'  // ← BLANC en mode sombre
    },
    statLabel: { 
      fontSize: '13px', 
      color: darkMode ? '#cbd5e1' : '#64748b',  // ← GRIS CLAIR en mode sombre
      marginTop: '6px' 
    },
    progressionCard: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    progressionTitle: { 
      fontSize: '18px', 
      fontWeight: 'bold', 
      marginBottom: '16px', 
      color: darkMode ? '#ffffff' : '#1e293b',  // ← BLANC en mode sombre
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px' 
    },
    progressionBar: { background: darkMode ? '#334155' : '#e2e8f0', borderRadius: '10px', height: '8px', overflow: 'hidden', marginTop: '12px' },
    progressionFill: { background: 'linear-gradient(135deg, #667eea, #764ba2)', height: '100%', width: `${stats.progression}%`, borderRadius: '10px' },
    progressionText: { 
      fontSize: '13px', 
      color: darkMode ? '#cbd5e1' : '#64748b',  // ← GRIS CLAIR en mode sombre
      marginTop: '12px' 
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    infoCard: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    sectionTitle: { 
      fontSize: '18px', 
      fontWeight: 'bold', 
      marginBottom: '16px', 
      color: darkMode ? '#ffffff' : '#1e293b',  // ← BLANC en mode sombre
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px' 
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { 
      padding: '12px', 
      textAlign: 'left', 
      color: darkMode ? '#cbd5e1' : '#64748b',  // ← GRIS CLAIR en mode sombre
      fontWeight: '600', 
      fontSize: '13px', 
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` 
    },
    td: { 
      padding: '12px', 
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
      fontSize: '14px', 
      color: darkMode ? '#e2e8f0' : '#475569'  // ← BLANC/GRIS en mode sombre
    },
    emptyState: { 
      textAlign: 'center', 
      padding: '40px', 
      color: darkMode ? '#cbd5e1' : '#64748b'   // ← GRIS CLAIR en mode sombre
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar user={currentUser} onLogout={onLogout} />
        <div style={{ textAlign: 'center', padding: '50px', color: darkMode ? '#cbd5e1' : '#64748b' }}>⏳ Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <Navbar user={currentUser} onLogout={onLogout} />
      
      <div style={styles.container}>
        {/* Header avec avatar */}
        <div style={styles.headerCard}>
          <div style={styles.userInfo}>
            <AvatarManager user={currentUser} />
            <div>
              <h1 style={styles.userName}>{currentUser?.firstName} {currentUser?.lastName}</h1>
              <div style={styles.userEmail}>
                <Icon name="email" size={14} color={darkMode ? '#cbd5e1' : '#64748b'} />
                {currentUser?.email}
              </div>
              <div style={styles.userRole}>
                Porteur de projet
              </div>
            </div>
          </div>
          <button onClick={() => setShowCreerProjet(true)} style={styles.btnPrimary}>
            <Icon name="add_circle" size={18} color="white" /> Nouveau projet
          </button>
        </div>

        {/* Statistiques */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.projetsCount}</div>
            <div style={styles.statLabel}>Mes projets</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.tachesCount}</div>
            <div style={styles.statLabel}>Tâches à faire</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.etapesCount}</div>
            <div style={styles.statLabel}>Étapes restantes</div>
          </div>
        </div>

        {/* Progression */}
        <div style={styles.progressionCard}>
          <div style={styles.progressionTitle}>
            <Icon name="chart" size={18} color="#667eea" />
            Progression globale
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: darkMode ? '#cbd5e1' : '#64748b' }}>Programme Early Stage</span>
            <span style={{ fontWeight: 'bold', color: darkMode ? '#ffffff' : '#1e293b' }}>{stats.progression}%</span>
          </div>
          <div style={styles.progressionBar}>
            <div style={styles.progressionFill} />
          </div>
          <div style={styles.progressionText}>
            {stats.progression === 0 ? '📌 Soumettez votre premier document pour démarrer' : '🎉 Continuez sur votre lancée !'}
          </div>
        </div>

        {/* Analyse IA */}
        <GestionAnalysesIA />

        {/* Calendrier */}
        <Calendrier />

        {/* Mes projets */}
        <div style={styles.infoCard}>
          <div style={styles.sectionTitle}><Icon name="business" size={18} color="#667eea" /> Mes projets</div>
          {projets.length === 0 ? (
            <div style={styles.emptyState}>📭 Aucun projet pour le moment</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Projet</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Statut</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projets.map(p => (
                    <tr key={p._id}>
                      <td style={styles.td}><strong>{p.titre || p.nomProjet}</strong></td>
                      <td style={styles.td}>{p.description || '—'}</td>
                      <td style={styles.td}>{getStatutBadge(p.statut)}</td>
                      <td style={styles.td}>{new Date(p.dateDebut).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Suivi des étapes */}
        <SuiviEtapes />

        {/* Tâches */}
        <div style={styles.infoCard}>
          <div style={styles.sectionTitle}><Icon name="tasks" size={18} color="#667eea" /> Tâches externes</div>
          {taches.length === 0 ? (
            <div style={styles.emptyState}>📭 Aucune tâche pour le moment</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Tâche</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Statut</th>
                    <th style={styles.th}>Date limite</th>
                  </tr>
                </thead>
                <tbody>
                  {taches.map(t => (
                    <tr key={t._id}>
                      <td style={styles.td}><strong>{t.titre}</strong></td>
                      <td style={styles.td}>{t.description || '—'}</td>
                      <td style={styles.td}>
                        {t.estComplete ? 
                          <span style={{ background: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>✅ Complétée</span> :
                          <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>⏳ En cours</span>
                        }
                      </td>
                      <td style={styles.td}>{t.dateLimite ? new Date(t.dateLimite).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <PiedDePage />

      {showCreerProjet && <CreerProjet onClose={() => setShowCreerProjet(false)} onSuccess={loadData} />}
    </div>
  );
}

export default TableauBordPorteur;