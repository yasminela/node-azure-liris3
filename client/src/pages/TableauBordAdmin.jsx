import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../composants/Navbar';
import Calendrier from '../composants/Calendrier';
import CreationPorteur from '../composants/CreationPorteur';
import EnvoiTache from '../composants/EnvoiTache';
import ModifierPorteur from '../composants/ModifierPorteur';
import ValidationDocument from '../composants/ValidationDocument';
import AssignerEtapes from '../composants/AssignerEtapes';
import EarlyStageTimeline from '../composants/EarlyStageTimeline';
import GestionAnalysesIA from '../composants/GestionAnalysesIA';
import ScoresPorteurs from '../composants/ScoresPorteurs';
import AvatarManager from '../composants/AvatarManager';
import GlassCard from '../composants/ui/GlassCard';
import ToastNotification from '../composants/ui/ToastNotification';
import PiedDePage from '../composants/PiedDePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faUsers, faBuilding, faFileAlt, faEye, 
  faUserPlus, faPaperPlane, faTasks, faUserCircle, 
  faExclamationTriangle, faEdit, faTrash, faCheck, faTimes
} from '@fortawesome/free-solid-svg-icons';

function TableauBordAdmin({ user, onLogout }) {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({ projets: 0, porteurs: 0, soumissions: 0 });
  const [porteurs, setPorteurs] = useState([]);
  const [projets, setProjets] = useState([]);
  const [showCreationPorteur, setShowCreationPorteur] = useState(false);
  const [showEnvoiTache, setShowEnvoiTache] = useState(false);
  const [showEditPorteur, setShowEditPorteur] = useState(false);
  const [showAssignerEtapes, setShowAssignerEtapes] = useState(false);
  const [selectedPorteur, setSelectedPorteur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(user);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadAllData();
    loadUserProfile();
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
      console.error('Erreur chargement profil:', error);
    }
  };

  const handleAvatarUpdate = (newAvatar) => {
    setCurrentUser(prev => ({ ...prev, avatar: newAvatar }));
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    storedUser.avatar = newAvatar;
    localStorage.setItem('user', JSON.stringify(storedUser));
    showToastMessage('success', 'Photo de profil mise à jour !');
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [projetsRes, utilisateursRes, soumissionsRes] = await Promise.all([
        api.get('/projets/tous'),
        api.get('/utilisateurs'),
        api.get('/etapes/soumissions')
      ]);
      setStats({
        projets: projetsRes.data?.length || 0,
        porteurs: utilisateursRes.data?.filter(u => u.role === 'porteur').length || 0,
        soumissions: soumissionsRes.data?.length || 0
      });
      setPorteurs(utilisateursRes.data?.filter(u => u.role === 'porteur') || []);
      setProjets(projetsRes.data || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePorteur = async (id) => {
    if (confirm('Supprimer ce porteur ?')) {
      try {
        await api.delete(`/utilisateurs/${id}`);
        await loadAllData();
        showToastMessage('success', '✅ Porteur supprimé');
      } catch (error) {
        showToastMessage('error', '❌ Erreur lors de la suppression');
      }
    }
  };

  const handleDeleteProjet = async (id) => {
    if (confirm('Supprimer ce projet ?')) {
      try {
        await api.delete(`/projets/${id}`);
        await loadAllData();
        showToastMessage('success', '✅ Projet supprimé');
      } catch (error) {
        showToastMessage('error', '❌ Erreur lors de la suppression');
      }
    }
  };

  const handleValidateProjet = async (id, statut, feedback) => {
    try {
      if (statut === 'valide') {
        await api.put(`/projets/valider/${id}`, { feedback });
        showToastMessage('success', '✅ Projet validé');
      } else {
        await api.put(`/projets/rejeter/${id}`, { feedback });
        showToastMessage('error', '❌ Projet rejeté');
      }
      await loadAllData();
    } catch (error) {
      showToastMessage('error', 'Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: { background: '#fef3c7', color: '#d97706', text: '⏳ En attente', icon: faExclamationTriangle },
      valide: { background: '#d1fae5', color: '#059669', text: '✅ Validé', icon: faCheck },
      rejete: { background: '#fee2e2', color: '#dc2626', text: '❌ Rejeté', icon: faTimes }
    };
    const b = badges[statut] || { background: '#f3f4f6', color: '#374151', text: statut, icon: faTasks };
    return (
      <span style={{ background: b.background, color: b.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <FontAwesomeIcon icon={b.icon} size="sm" color={b.color} />
        {b.text}
      </span>
    );
  };

  const styles = {
    container: { padding: 'clamp(16px, 5vw, 24px)', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' },
    profileCard: { display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 'bold', marginBottom: '4px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    profileEmail: { color: darkMode ? '#94a3b8' : '#475569', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 14px)' },
    profileBadge: {
      background: 'linear-gradient(135deg, #9333ea20, #06b6d420)',
      color: '#9333ea',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      display: 'inline-block'
    },
    statsContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(16px, 3vw, 24px)', marginBottom: '32px' },
    statCard: {
      padding: 'clamp(16px, 4vw, 24px)',
      borderRadius: '24px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      minHeight: '160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: darkMode ? '#1e293b' : 'white',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    statNumber: { fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', marginBottom: '8px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    statLabel: { fontSize: 'clamp(12px, 3vw, 14px)', color: darkMode ? '#94a3b8' : '#475569' },
    buttonGroup: { display: 'flex', gap: '16px', marginBottom: '30px', flexWrap: 'wrap' },
    actionBtn: { 
      padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)', 
      border: 'none', 
      borderRadius: '12px', 
      cursor: 'pointer', 
      fontWeight: 'bold', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      transition: 'transform 0.2s',
      background: darkMode ? '#1e293b' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b'
    },
    btnPrimary: { background: '#9333ea', color: 'white' },
    btnSuccess: { background: '#10b981', color: 'white' },
    btnPurple: { background: '#8b5cf6', color: 'white' },
    infoCard: { 
      background: darkMode ? '#1e293b' : 'white', 
      borderRadius: '20px', 
      padding: 'clamp(16px, 4vw, 24px)', 
      marginBottom: '24px', 
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` 
    },
    sectionTitle: { 
      fontSize: 'clamp(18px, 4vw, 20px)', 
      fontWeight: 'bold', 
      marginBottom: '20px', 
      color: darkMode ? '#f1f5f9' : '#1e293b',
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      borderLeft: '4px solid #9333ea', 
      paddingLeft: '16px' 
    },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', overflowX: 'auto' },
    th: { 
      padding: 'clamp(10px, 2vw, 14px)', 
      textAlign: 'left', 
      background: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.8)', 
      color: darkMode ? '#94a3b8' : '#475569',
      fontWeight: '600', 
      fontSize: 'clamp(12px, 2.5vw, 14px)', 
      borderBottom: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    td: { 
      padding: 'clamp(10px, 2vw, 14px)', 
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, 
      fontSize: 'clamp(12px, 2.5vw, 14px)', 
      color: darkMode ? '#f1f5f9' : '#1e293b'
    },
    btnEdit: { background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' },
    btnDelete: { background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' },
    btnValidate: { background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' },
    btnReject: { background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' },
    emptyState: { textAlign: 'center', padding: 'clamp(30px, 8vw, 48px)', color: darkMode ? '#94a3b8' : '#475569' },
    tabsContainer: { display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, paddingBottom: '12px', flexWrap: 'wrap' },
    tab: (active) => ({
      padding: '10px 20px',
      background: active ? '#9333ea' : 'transparent',
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
    programCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    programCard: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '16px',
      padding: '16px',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      transition: 'transform 0.2s',
      cursor: 'pointer'
    },
    programImage: {
      width: '100%',
      borderRadius: '12px',
      marginBottom: '12px'
    },
    programCaption: {
      fontSize: '14px',
      textAlign: 'center',
      color: darkMode ? '#94a3b8' : '#475569',
      marginTop: '8px'
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar user={currentUser} onLogout={onLogout} />
        <div className="loading-container">
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(147, 51, 234, 0.2)', borderTop: '3px solid #9333ea', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: darkMode ? '#94a3b8' : '#475569' }}>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <Navbar user={currentUser} onLogout={onLogout} />
      <div style={styles.container}>
        
        {/* Profile Card Admin */}
        <GlassCard>
          <div style={styles.profileCard}>
            <AvatarManager user={currentUser} onAvatarUpdate={handleAvatarUpdate} />
            <div style={styles.profileInfo}>
              <h1 style={styles.profileName}>{currentUser?.firstName} {currentUser?.lastName}</h1>
              <p style={styles.profileEmail}>{currentUser?.email}</p>
              <span style={styles.profileBadge}><FontAwesomeIcon icon={faUserCircle} style={{ marginRight: '6px' }} /> Administrateur</span>
            </div>
          </div>
        </GlassCard>

        {/* Programme Images */}
        <div style={styles.programCards}>
          <div style={styles.programCard}>
            <img src="/prog1.png" alt="Master Plan" style={styles.programImage} onError={(e) => e.target.style.display = 'none'} />
            <p style={styles.programCaption}>Le Master Plan : 3 Phases de Transformation</p>
          </div>
          <div style={styles.programCard}>
            <img src="/prog2.png" alt="Écosystème Dual" style={styles.programImage} onError={(e) => e.target.style.display = 'none'} />
            <p style={styles.programCaption}>La Matrice de Soutien : Un Écosystème Dual</p>
          </div>
        </div>

        <EarlyStageTimeline />

        <div style={styles.tabsContainer}>
          <button style={styles.tab(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}><FontAwesomeIcon icon={faChartLine} /> Tableau de bord</button>
          <button style={styles.tab(activeTab === 'porteurs')} onClick={() => setActiveTab('porteurs')}><FontAwesomeIcon icon={faUsers} /> Porteurs ({porteurs.length})</button>
          <button style={styles.tab(activeTab === 'projets')} onClick={() => setActiveTab('projets')}><FontAwesomeIcon icon={faBuilding} /> Projets à valider</button>
          <button style={styles.tab(activeTab === 'soumissions')} onClick={() => setActiveTab('soumissions')}><FontAwesomeIcon icon={faFileAlt} /> Soumissions ({stats.soumissions})</button>
          <button style={styles.tab(activeTab === 'analyses')} onClick={() => setActiveTab('analyses')}><FontAwesomeIcon icon={faEye} /> Analyses IA</button>
          <button style={styles.tab(activeTab === 'scores')} onClick={() => setActiveTab('scores')}><FontAwesomeIcon icon={faChartLine} /> Scores porteurs</button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div style={styles.statsContainer}>
              <div style={styles.statCard}>
                <div style={{ width: 'clamp(50px, 10vw, 60px)', height: 'clamp(50px, 10vw, 60px)', background: '#9333ea15', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><FontAwesomeIcon icon={faBuilding} size="2x" color="#9333ea" /></div>
                <div style={styles.statNumber}>{stats.projets}</div>
                <div style={styles.statLabel}>Projets</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ width: 'clamp(50px, 10vw, 60px)', height: 'clamp(50px, 10vw, 60px)', background: '#9333ea15', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><FontAwesomeIcon icon={faUsers} size="2x" color="#9333ea" /></div>
                <div style={styles.statNumber}>{stats.porteurs}</div>
                <div style={styles.statLabel}>Porteurs</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ width: 'clamp(50px, 10vw, 60px)', height: 'clamp(50px, 10vw, 60px)', background: '#f59e0b15', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="#f59e0b" /></div>
                <div style={styles.statNumber}>{stats.soumissions}</div>
                <div style={styles.statLabel}>Soumissions en attente</div>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button onClick={() => setShowCreationPorteur(true)} style={{ ...styles.actionBtn, ...styles.btnPrimary }}><FontAwesomeIcon icon={faUserPlus} /> Créer un porteur</button>
              <button onClick={() => setShowEnvoiTache(true)} style={{ ...styles.actionBtn, ...styles.btnSuccess }}><FontAwesomeIcon icon={faPaperPlane} /> Envoyer une tâche</button>
              <button onClick={() => setShowAssignerEtapes(true)} style={{ ...styles.actionBtn, ...styles.btnPurple }}><FontAwesomeIcon icon={faTasks} /> Assigner programme Early-Stage</button>
            </div>

            <Calendrier onEventAdded={loadAllData} />
            <ValidationDocument onValidate={loadAllData} />
          </>
        )}

        {activeTab === 'porteurs' && (
          <div style={styles.infoCard}>
            <div style={styles.sectionTitle}><FontAwesomeIcon icon={faUsers} /> Liste des porteurs</div>
            {porteurs.length === 0 ? (
              <div style={styles.emptyState}>Aucun porteur créé</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Nom</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Téléphone</th>
                      <th style={styles.th}>Projet</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {porteurs.map(p => (
                      <tr key={p._id}>
                        <td style={styles.td}>{p.firstName} {p.lastName}</td>
                        <td style={styles.td}>{p.email}</td>
                        <td style={styles.td}>{p.telephone || '—'}</td>
                        <td style={styles.td}>{p.nomProjet || '—'}</td>
                        <td style={styles.td}>
                          <button onClick={() => { setSelectedPorteur(p); setShowEditPorteur(true); }} style={styles.btnEdit}>
                            <FontAwesomeIcon icon={faEdit} size="sm" /> Modifier
                          </button>
                          <button onClick={() => handleDeletePorteur(p._id)} style={styles.btnDelete}>
                            <FontAwesomeIcon icon={faTrash} size="sm" /> Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projets' && (
          <div style={styles.infoCard}>
            <div style={styles.sectionTitle}><FontAwesomeIcon icon={faBuilding} /> Projets à valider</div>
            {projets.filter(p => p.statut === 'en_attente').length === 0 ? (
              <div style={styles.emptyState}>Aucun projet en attente</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Projet</th>
                      <th style={styles.th}>Porteur</th>
                      <th style={styles.th}>Statut</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projets.filter(p => p.statut === 'en_attente').map(p => (
                      <tr key={p._id}>
                        <td style={styles.td}><strong>{p.titre || p.nomProjet}</strong></td>
                        <td style={styles.td}>{p.porteurId?.firstName} {p.porteurId?.lastName}</td>
                        <td style={styles.td}>{getStatutBadge(p.statut)}</td>
                        <td style={styles.td}>
                          <button onClick={() => handleValidateProjet(p._id, 'valide', '')} style={styles.btnValidate}>
                            <FontAwesomeIcon icon={faCheck} size="sm" /> Valider
                          </button>
                          <button onClick={() => handleValidateProjet(p._id, 'rejete', 'Projet non conforme')} style={styles.btnReject}>
                            <FontAwesomeIcon icon={faTimes} size="sm" /> Rejeter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'soumissions' && <ValidationDocument onValidate={loadAllData} />}
        {activeTab === 'analyses' && <GestionAnalysesIA />}
        {activeTab === 'scores' && <ScoresPorteurs />}
      </div>

      <PiedDePage />

      {showCreationPorteur && <CreationPorteur onClose={() => setShowCreationPorteur(false)} onSuccess={() => { loadAllData(); }} />}
      {showEnvoiTache && <EnvoiTache onClose={() => setShowEnvoiTache(false)} onSuccess={loadAllData} />}
      {showAssignerEtapes && <AssignerEtapes onClose={() => setShowAssignerEtapes(false)} onSuccess={loadAllData} />}
      {showEditPorteur && selectedPorteur && <ModifierPorteur porteur={selectedPorteur} onClose={() => { setShowEditPorteur(false); setSelectedPorteur(null); }} onSuccess={() => { loadAllData(); }} />}
      
      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}

export default TableauBordAdmin;