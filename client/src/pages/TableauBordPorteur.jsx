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
import ValidationDocument from '../composants/ValidationDocument';
import EarlyStageTimeline from '../composants/EarlyStageTimeline';
import GlassCard from '../composants/ui/GlassCard';
import ToastNotification from '../composants/ui/ToastNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faFileAlt, faEye, faCheck, faTimes, 
  faExclamationTriangle, faBuilding, faTasks, faUpload,
  faDownload, faShareAlt, faHistory, faBell, faRocket,
  faCalendar, faClipboardList, faUserGraduate, faAward
} from '@fortawesome/free-solid-svg-icons';

function TableauBordPorteur({ user, onLogout }) {
  const { darkMode } = useTheme();
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [showCreerProjet, setShowCreerProjet] = useState(false);
  const [stats, setStats] = useState({ projetsCount: 0, tachesCount: 0, etapesCount: 0, progression: 0 });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [soumissions, setSoumissions] = useState([]);
  const [toast, setToast] = useState(null);
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    loadData();
    loadUserProfile();
    loadSoumissions();
    loadAnalysesIA();
  }, []);

  const showToastMessage = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUserProfile = async () => {
    try {
      const res = await api.get('/utilisateurs/me');
      setCurrentUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAvatarUpdate = (newAvatar) => {
    setCurrentUser(prev => ({ ...prev, avatar: newAvatar }));
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    storedUser.avatar = newAvatar;
    localStorage.setItem('user', JSON.stringify(storedUser));
    showToastMessage('success', 'Photo de profil mise à jour !');
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
      showToastMessage('error', 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const loadSoumissions = async () => {
    try {
      const res = await api.get('/etapes/mes-soumissions');
      setSoumissions(res.data || []);
    } catch (error) {
      console.error('Erreur chargement soumissions:', error);
    }
  };

  const loadAnalysesIA = async () => {
    try {
      const res = await api.get('/analyses/mes-analyses');
      setAnalyses(res.data || []);
    } catch (error) {
      console.error('Erreur chargement analyses IA:', error);
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: { background: '#fef3c7', color: '#d97706', text: '⏳ En attente', icon: faExclamationTriangle },
      valide: { background: '#d1fae5', color: '#059669', text: '✅ Validé', icon: faCheck },
      rejete: { background: '#fee2e2', color: '#dc2626', text: '❌ Rejeté', icon: faTimes }
    };
    const b = badges[statut] || badges.en_attente;
    return (
      <span style={{ background: b.background, color: b.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <FontAwesomeIcon icon={b.icon} size="sm" color={b.color} />
        {b.text}
      </span>
    );
  };

  const styles = {
    container: { padding: 'clamp(16px, 4vw, 24px)', maxWidth: '1400px', margin: '0 auto' },
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
      color: darkMode ? '#ffffff' : '#1e293b',
      marginBottom: '4px' 
    },
    userEmail: { 
      color: darkMode ? '#cbd5e1' : '#64748b',
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
      color: darkMode ? '#ffffff' : '#1e293b'
    },
    statLabel: { 
      fontSize: '13px', 
      color: darkMode ? '#cbd5e1' : '#64748b',
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
      color: darkMode ? '#ffffff' : '#1e293b',
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px' 
    },
    progressionBar: { background: darkMode ? '#334155' : '#e2e8f0', borderRadius: '10px', height: '8px', overflow: 'hidden', marginTop: '12px' },
    progressionFill: { background: 'linear-gradient(135deg, #667eea, #764ba2)', height: '100%', width: `${stats.progression}%`, borderRadius: '10px' },
    progressionText: { 
      fontSize: '13px', 
      color: darkMode ? '#cbd5e1' : '#64748b',
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
      color: darkMode ? '#ffffff' : '#1e293b',
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      borderLeft: '4px solid #667eea',
      paddingLeft: '16px'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { 
      padding: '12px', 
      textAlign: 'left', 
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontWeight: '600', 
      fontSize: '13px', 
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` 
    },
    td: { 
      padding: '12px', 
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
      fontSize: '14px', 
      color: darkMode ? '#e2e8f0' : '#475569'
    },
    emptyState: { 
      textAlign: 'center', 
      padding: '40px', 
      color: darkMode ? '#cbd5e1' : '#64748b'
    },
    tabsContainer: { 
      display: 'flex', 
      gap: '8px', 
      marginBottom: '24px', 
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
      paddingBottom: '12px', 
      flexWrap: 'wrap' 
    },
    tab: (active) => ({
      padding: '10px 20px',
      background: active ? '#667eea' : 'transparent',
      color: active ? 'white' : (darkMode ? '#94a3b8' : '#475569'),
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease'
    }),
    programImagesContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    programImageCard: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '16px',
      padding: '16px',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      transition: 'transform 0.2s',
      textAlign: 'center'
    },
    programImage: {
      width: '100%',
      borderRadius: '12px',
      marginBottom: '12px'
    },
    programCaption: {
      fontSize: '13px',
      color: darkMode ? '#94a3b8' : '#64748b',
      marginTop: '8px',
      fontWeight: '500'
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar user={currentUser} onLogout={onLogout} />
        <div style={{ textAlign: 'center', padding: '50px', color: darkMode ? '#cbd5e1' : '#64748b' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(102, 126, 234, 0.2)', borderTop: '3px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          ⏳ Chargement de votre espace porteur...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <Navbar user={currentUser} onLogout={onLogout} />
      
      <div style={styles.container}>
        {/* Header avec avatar */}
        <GlassCard>
          <div style={styles.headerCard}>
            <div style={styles.userInfo}>
              <AvatarManager user={currentUser} onAvatarUpdate={handleAvatarUpdate} size="large" />
              <div>
                <h1 style={styles.userName}>{currentUser?.firstName} {currentUser?.lastName}</h1>
                <div style={styles.userEmail}>
                  <Icon name="email" size={14} color={darkMode ? '#cbd5e1' : '#64748b'} />
                  {currentUser?.email}
                </div>
                <div style={styles.userRole}>
                  <FontAwesomeIcon icon={faUserGraduate} style={{ marginRight: '6px' }} />
                  Porteur de projet - Programme Early Stage
                </div>
              </div>
            </div>
            <button onClick={() => setShowCreerProjet(true)} style={styles.btnPrimary}>
              <FontAwesomeIcon icon={faBuilding} /> Nouveau projet
            </button>
          </div>
        </GlassCard>

        {/* Programme Images - Comme dans l'admin */}
        <div style={styles.programImagesContainer}>
          <div style={styles.programImageCard}>
            <img 
              src="/prog1.png" 
              alt="Master Plan" 
              style={styles.programImage} 
              onError={(e) => e.target.style.display = 'none'} 
            />
            <p style={styles.programCaption}>
              <FontAwesomeIcon icon={faRocket} style={{ marginRight: '6px', color: '#667eea' }} />
              Le Master Plan : 3 Phases de Transformation
            </p>
          </div>
          <div style={styles.programImageCard}>
            <img 
              src="/prog2.png" 
              alt="Écosystème Dual" 
              style={styles.programImage} 
              onError={(e) => e.target.style.display = 'none'} 
            />
            <p style={styles.programCaption}>
              <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '6px', color: '#667eea' }} />
              La Matrice de Soutien : Un Écosystème Dual
            </p>
          </div>
        </div>

        {/* Timeline du programme Early Stage - Comme dans l'admin */}
        <EarlyStageTimeline />

        {/* Onglets pour les différentes sections */}
        <div style={styles.tabsContainer}>
          <button style={styles.tab(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>
            <FontAwesomeIcon icon={faChartLine} /> Tableau de bord
          </button>
          <button style={styles.tab(activeTab === 'programme')} onClick={() => setActiveTab('programme')}>
            <FontAwesomeIcon icon={faRocket} /> Mon programme
          </button>
          <button style={styles.tab(activeTab === 'soumissions')} onClick={() => setActiveTab('soumissions')}>
            <FontAwesomeIcon icon={faUpload} /> Mes soumissions ({soumissions.length})
          </button>
          <button style={styles.tab(activeTab === 'analyses')} onClick={() => setActiveTab('analyses')}>
            <FontAwesomeIcon icon={faEye} /> Analyses IA
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
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
              <div style={styles.statCard}>
                <div style={styles.statValue}>{soumissions.filter(s => s.statut === 'en_attente').length}</div>
                <div style={styles.statLabel}>Soumissions en attente</div>
              </div>
            </div>

            {/* Progression */}
            <div style={styles.progressionCard}>
              <div style={styles.progressionTitle}>
                <FontAwesomeIcon icon={faAward} color="#667eea" />
                Progression du programme Early Stage
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: darkMode ? '#cbd5e1' : '#64748b' }}>6 mois d'accompagnement intensif</span>
                <span style={{ fontWeight: 'bold', color: darkMode ? '#ffffff' : '#1e293b' }}>{stats.progression}%</span>
              </div>
              <div style={styles.progressionBar}>
                <div style={styles.progressionFill} />
              </div>
              <div style={styles.progressionText}>
                {stats.progression === 0 
                  ? '🚀 Commencez votre parcours en soumettant votre premier document !' 
                  : stats.progression === 100 
                    ? '🎉 Félicitations ! Vous avez terminé toutes les étapes du programme !'
                    : '🎯 Continuez vos efforts, vous progressez bien !'}
              </div>
            </div>

            {/* Calendrier */}
            <Calendrier />

            {/* Mes projets */}
            <div style={styles.infoCard}>
              <div style={styles.sectionTitle}>
                <FontAwesomeIcon icon={faBuilding} color="#667eea" /> 
                Mes projets
              </div>
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

            {/* Tâches */}
            <div style={styles.infoCard}>
              <div style={styles.sectionTitle}>
                <FontAwesomeIcon icon={faTasks} color="#667eea" /> 
                Tâches externes
              </div>
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
          </>
        )}

        {activeTab === 'programme' && (
          <>
            {/* Ré-afficher le programme complet */}
            <div style={styles.programImagesContainer}>
              <div style={styles.programImageCard}>
                <img src="/prog1.png" alt="Master Plan" style={styles.programImage} onError={(e) => e.target.style.display = 'none'} />
                <p style={styles.programCaption}>Le Master Plan : 3 Phases de Transformation</p>
              </div>
              <div style={styles.programImageCard}>
                <img src="/prog2.png" alt="Écosystème Dual" style={styles.programImage} onError={(e) => e.target.style.display = 'none'} />
                <p style={styles.programCaption}>La Matrice de Soutien : Un Écosystème Dual</p>
              </div>
            </div>
            <EarlyStageTimeline />
            <div style={styles.infoCard}>
              <div style={styles.sectionTitle}>
                <FontAwesomeIcon icon={faClipboardList} color="#667eea" />
                Suivi détaillé des étapes
              </div>
              <SuiviEtapes />
            </div>
          </>
        )}

        {activeTab === 'soumissions' && (
          <ValidationDocument 
            onValidate={() => {
              loadSoumissions();
              loadData();
            }} 
          />
        )}

        {activeTab === 'analyses' && (
          <GestionAnalysesIA />
        )}
      </div>

      <PiedDePage />

      {showCreerProjet && (
        <CreerProjet 
          onClose={() => setShowCreerProjet(false)} 
          onSuccess={() => {
            loadData();
            showToastMessage('success', '✅ Projet créé avec succès !');
          }} 
        />
      )}

      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}

export default TableauBordPorteur;