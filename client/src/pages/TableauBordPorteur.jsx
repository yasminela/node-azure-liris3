import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../composants/Navbar';
import Calendrier from '../composants/Calendrier';
import SuiviEtapes from '../composants/SuiviEtapes';
import CreerProjet from '../composants/CreerProjet';
import PiedDePage from '../composants/PiedDePage';
import AvatarManager from '../composants/AvatarManager';
import GestionAnalysesIA from '../composants/GestionAnalysesIA';
import ValidationDocument from '../composants/ValidationDocument';
import EarlyStageTimeline from '../composants/EarlyStageTimeline';
import ToastNotification from '../composants/ui/ToastNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faFileAlt, faEye, faCheck, faTimes, 
  faExclamationTriangle, faBuilding, faTasks, faUpload,
  faRocket, faClipboardList, faUserGraduate, faAward,
  faCalendar, faBell, faHistory, faSpinner, faRobot
} from '@fortawesome/free-solid-svg-icons';

function TableauBordPorteur({ user, onLogout }) {
  const { darkMode } = useTheme();
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [etapes, setEtapes] = useState([]);
  const [showCreerProjet, setShowCreerProjet] = useState(false);
  const [stats, setStats] = useState({ projetsCount: 0, tachesCount: 0, etapesCount: 0, progression: 0 });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [soumissions, setSoumissions] = useState([]);
  const [toast, setToast] = useState(null);

  const colors = {
    primary: '#9333ea',
    primaryLight: '#a855f7',
    secondary: '#ec4899',
    gradient1: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #06b6d4 100%)',
    gradient2: 'linear-gradient(135deg, #7e22ce 0%, #db2777 100%)'
  };

  useEffect(() => {
    loadData();
    loadUserProfile();
    loadSoumissions();
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

      const etapesData = etapesRes.data || [];
      const etapesValidees = etapesData.filter(e => e.statut === 'validee').length;
      const totalEtapes = etapesData.length;
      const progression = totalEtapes > 0 ? Math.round((etapesValidees / totalEtapes) * 100) : 0;
      const etapesRestantes = etapesData.filter(e => e.statut !== 'validee').length;

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

  // LOADER MODERNE
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
        <Navbar user={currentUser} onLogout={onLogout} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 70px)',
          gap: '24px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #9333ea, #ec4899, #06b6d4)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <img src="/logo-incubiny.png" alt="Incubiny" style={{ width: '45px', height: '45px', filter: 'brightness(0) invert(1)' }} />
          </div>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid rgba(147, 51, 234, 0.2)',
            borderTop: '3px solid #9333ea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: darkMode ? '#94a3b8' : '#475569', fontSize: '14px' }}>
            <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />
            Chargement de votre espace porteur...
          </p>
          <div style={{
            width: '250px',
            height: '3px',
            background: darkMode ? '#334155' : '#e2e8f0',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg, #9333ea, #ec4899, #06b6d4)',
              animation: 'loading 1.5s ease-in-out infinite'
            }} />
          </div>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin { 100% { transform: rotate(360deg); } }
            @keyframes pulse { 
              0%, 100% { transform: scale(1); } 
              50% { transform: scale(1.1); } 
            }
            @keyframes loading { 
              0% { width: 0%; } 
              50% { width: 80%; } 
              100% { width: 100%; } 
            }
          `
        }} />
      </div>
    );
  }

  const styles = {
    container: { 
      padding: 'clamp(16px, 4vw, 24px)', 
      maxWidth: '1400px', 
      margin: '0 auto',
      minHeight: 'calc(100vh - 200px)',
      position: 'relative',
      zIndex: 1
    },
    backgroundDecoration: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: darkMode ? '#0f172a' : '#f8fafc',
      zIndex: 0
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: darkMode ? 'radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.15) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(6, 182, 212, 0.05) 100%)' : 'radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.08) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(6, 182, 212, 0.03) 100%)',
      zIndex: 1
    },
    headerCard: { 
      background: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(147, 51, 234, 0.2)'}`,
      position: 'relative',
      zIndex: 2
    },
    userInfo: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
    userName: { 
      fontSize: 'clamp(20px, 5vw, 24px)', 
      fontWeight: 'bold', 
      marginBottom: '4px',
      color: darkMode ? '#ffffff' : '#1e293b'
    },
    userEmail: { 
      color: darkMode ? '#cbd5e1' : '#475569',
      fontSize: '13px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px' 
    },
    userRole: { 
      marginTop: '8px',
      background: colors.gradient2,
      color: 'white', 
      padding: '4px 12px', 
      borderRadius: '20px', 
      fontSize: '11px',
      display: 'inline-block'
    },
    btnPrimary: {
      background: colors.gradient1,
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
    statsGrid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '20px', 
      marginBottom: '24px',
      position: 'relative',
      zIndex: 2
    },
    statCard: {
      background: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      padding: '20px',
      borderRadius: '20px',
      textAlign: 'center',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(147, 51, 234, 0.2)'}`,
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    statValue: { 
      fontSize: 'clamp(28px, 5vw, 36px)', 
      fontWeight: 'bold', 
      color: darkMode ? '#f1f5f9' : '#1e293b'
    },
    statLabel: { 
      fontSize: '13px', 
      color: darkMode ? '#cbd5e1' : '#64748b',
      marginTop: '6px' 
    },
    progressionCard: {
      background: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '24px',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(147, 51, 234, 0.2)'}`,
      position: 'relative',
      zIndex: 2
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
    progressionBar: { 
      background: darkMode ? '#334155' : '#e2e8f0', 
      borderRadius: '10px', 
      height: '8px', 
      overflow: 'hidden', 
      marginTop: '12px' 
    },
    progressionFill: { 
      background: colors.gradient1, 
      height: '100%', 
      width: `${stats.progression}%`, 
      borderRadius: '10px' 
    },
    progressionText: { 
      fontSize: '13px', 
      color: darkMode ? '#cbd5e1' : '#64748b',
      marginTop: '12px' 
    },
    infoCard: {
      background: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '24px',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(147, 51, 234, 0.2)'}`,
      position: 'relative',
      zIndex: 2
    },
    sectionTitle: { 
      fontSize: '18px', 
      fontWeight: 'bold', 
      marginBottom: '16px', 
      color: darkMode ? '#ffffff' : '#1e293b',
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      borderLeft: `4px solid ${colors.primary}`,
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
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 2
    },
    tab: (active) => ({
      padding: '10px 20px',
      background: active ? colors.gradient1 : 'transparent',
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
      marginBottom: '24px',
      position: 'relative',
      zIndex: 2
    },
    programImageCard: {
      background: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      padding: '16px',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(147, 51, 234, 0.2)'}`,
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
    },
    soumissionsBadge: {
      background: colors.primary,
      color: 'white',
      borderRadius: '20px',
      padding: '2px 8px',
      fontSize: '12px',
      marginLeft: '8px'
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes loading { 0% { width: 0%; } 50% { width: 80%; } 100% { width: 100%; } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          .btn-shine { position: relative; overflow: hidden; transition: all 0.3s ease; }
          .btn-shine::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transition: left 0.5s ease; }
          .btn-shine:hover::before { left: 100%; }
          .btn-shine:hover { transform: translateY(-2px); }
          .stat-card:hover, .program-card:hover { transform: translateY(-5px); }
        `
      }} />

      <div style={styles.backgroundDecoration}>
        <div style={styles.gradientOverlay} />
      </div>

      <Navbar user={currentUser} onLogout={onLogout} />
      
      <div style={styles.container}>
        {/* Header avec avatar */}
        <div style={styles.headerCard}>
          <div style={styles.userInfo}>
            <AvatarManager user={currentUser} onAvatarUpdate={handleAvatarUpdate} size="large" />
            <div>
              <h1 style={styles.userName}>{currentUser?.firstName} {currentUser?.lastName}</h1>
              <div style={styles.userEmail}>
                <span>📧</span>
                {currentUser?.email}
              </div>
              <div style={styles.userRole}>
                <FontAwesomeIcon icon={faUserGraduate} style={{ marginRight: '6px' }} />
                Porteur de projet - Programme Early Stage
              </div>
            </div>
          </div>
          <button className="btn-shine" onClick={() => setShowCreerProjet(true)} style={styles.btnPrimary}>
            <FontAwesomeIcon icon={faBuilding} /> Nouveau projet
          </button>
        </div>

        {/* Onglets */}
        <div style={styles.tabsContainer}>
          <button className="btn-shine" style={styles.tab(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>
            <FontAwesomeIcon icon={faChartLine} /> Tableau de bord
          </button>
          <button className="btn-shine" style={styles.tab(activeTab === 'programme')} onClick={() => setActiveTab('programme')}>
            <FontAwesomeIcon icon={faRocket} /> Mon programme
          </button>
          <button className="btn-shine" style={styles.tab(activeTab === 'soumissions')} onClick={() => setActiveTab('soumissions')}>
            <FontAwesomeIcon icon={faUpload} /> Mes soumissions 
            {soumissions.filter(s => s.statut === 'soumise').length > 0 && (
              <span style={styles.soumissionsBadge}>{soumissions.filter(s => s.statut === 'soumise').length}</span>
            )}
          </button>
          <button className="btn-shine" style={styles.tab(activeTab === 'analyses')} onClick={() => setActiveTab('analyses')}>
            <FontAwesomeIcon icon={faRobot} /> Analyses IA
          </button>
        </div>

        {/* TABLEAU DE BORD */}
        {activeTab === 'dashboard' && (
          <>
            <div style={styles.statsGrid}>
              <div className="stat-card" style={styles.statCard}>
                <div style={styles.statValue}>{stats.projetsCount}</div>
                <div style={styles.statLabel}>Mes projets</div>
              </div>
              <div className="stat-card" style={styles.statCard}>
                <div style={styles.statValue}>{stats.tachesCount}</div>
                <div style={styles.statLabel}>Tâches à faire</div>
              </div>
              <div className="stat-card" style={styles.statCard}>
                <div style={styles.statValue}>{stats.etapesCount}</div>
                <div style={styles.statLabel}>Étapes restantes</div>
              </div>
              <div className="stat-card" style={styles.statCard}>
                <div style={styles.statValue}>{soumissions.filter(s => s.statut === 'soumise').length}</div>
                <div style={styles.statLabel}>Soumissions en attente</div>
              </div>
            </div>

            <div style={styles.progressionCard}>
              <div style={styles.progressionTitle}>
                <FontAwesomeIcon icon={faAward} color={colors.primary} />
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
                {stats.progression === 0 ? (
                  'Commencez votre parcours en soumettant votre premier document !'
                ) : stats.progression === 100 ? (
                  'Félicitations ! Vous avez terminé toutes les étapes du programme !'
                ) : (
                  `Excellente progression ! Continuez, vous êtes à ${stats.progression}% du programme.`
                )}
              </div>
            </div>

            <Calendrier />

            <div style={styles.infoCard}>
              <div style={styles.sectionTitle}>
                <FontAwesomeIcon icon={faBuilding} color={colors.primary} /> 
                Mes projets
              </div>
              {projets.length === 0 ? (
                <div style={styles.emptyState}>📭 Aucun projet pour le moment</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr><th style={styles.th}>Projet</th><th style={styles.th}>Description</th><th style={styles.th}>Statut</th><th style={styles.th}>Date</th></tr></thead>
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

            <div style={styles.infoCard}>
              <div style={styles.sectionTitle}>
                <FontAwesomeIcon icon={faTasks} color={colors.primary} /> 
                Tâches externes
              </div>
              {taches.length === 0 ? (
                <div style={styles.emptyState}>📭 Aucune tâche pour le moment</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr><th style={styles.th}>Tâche</th><th style={styles.th}>Description</th><th style={styles.th}>Statut</th><th style={styles.th}>Date limite</th></tr>
                    </thead>
                    <tbody>
                      {taches.map(t => (
                        <tr key={t._id}>
                          <td style={styles.td}><strong>{t.titre}</strong></td>
                          <td style={styles.td}>{t.description || '—'}</td>
                          <td style={styles.td}>
                            {t.estComplete ? 
                              <span style={{ background: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '20px' }}>✅ Complétée</span> :
                              <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '20px' }}>⏳ En cours</span>
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

        {/* MON PROGRAMME */}
{activeTab === 'programme' && (
  <>
    {/* Images du programme */}
    <div style={styles.programImagesContainer}>
      <div className="program-card" style={styles.programImageCard}>
        <img src="/prog1.png" alt="Master Plan" style={styles.programImage} />
        <p style={styles.programCaption}>Le Master Plan : 3 Phases de Transformation</p>
      </div>
      <div className="program-card" style={styles.programImageCard}>
        <img src="/prog2.png" alt="Écosystème Dual" style={styles.programImage} />
        <p style={styles.programCaption}>La Matrice de Soutien : Un Écosystème Dual</p>
      </div>
    </div>

    <EarlyStageTimeline />
    <SuiviEtapes />
  </>
)}{/* MON PROGRAMME */}
{activeTab === 'programme' && (
  <>
    <div style={styles.programImagesContainer}>
      <div className="program-card" style={styles.programImageCard}>
        <img src="/prog1.png" alt="Master Plan" style={styles.programImage} />
        <p style={styles.programCaption}>Le Master Plan : 3 Phases de Transformation</p>
      </div>
      <div className="program-card" style={styles.programImageCard}>
        <img src="/prog2.png" alt="Écosystème Dual" style={styles.programImage} />
        <p style={styles.programCaption}>La Matrice de Soutien : Un Écosystème Dual</p>
      </div>
    </div>
    <EarlyStageTimeline />
    <SuiviEtapes />
  </>
)}

        {/* MES SOUMISSIONS */}
        {activeTab === 'soumissions' && (
          <ValidationDocument 
            onValidate={() => {
              loadSoumissions();
              loadData();
            }} 
          />
        )}

        {/* ANALYSES IA */}
        {activeTab === 'analyses' && <GestionAnalysesIA />}
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