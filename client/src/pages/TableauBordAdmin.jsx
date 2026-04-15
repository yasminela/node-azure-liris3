import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../composants/Navbar';
import Calendrier from '../composants/Calendrier';
import CreationPorteur from '../composants/CreationPorteur';
import EnvoiTache from '../composants/EnvoiTache';
import ModifierPorteur from '../composants/ModifierPorteur';
import ValidationDocument from '../composants/ValidationDocument';
import AssignerEtapes from '../composants/AssignerEtapes';
import EarlyStageTimeline from '../composants/EarlyStageTimeline';
import Icon from '../composants/Icon';
import { iconColors } from '../styles/iconColors';

function TableauBordAdmin({ user, onLogout }) {
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

  useEffect(() => {
    loadAllData();
  }, []);

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
    if (confirm('Supprimer ce porteur ? Cette action est irréversible.')) {
      try {
        await api.delete(`/utilisateurs/${id}`);
        await loadAllData();
        alert('Porteur supprimé');
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleDeleteProjet = async (id) => {
    if (confirm('Supprimer ce projet ?')) {
      try {
        await api.delete(`/projets/${id}`);
        await loadAllData();
        alert('Projet supprimé');
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleValidateProjet = async (id, statut, feedback) => {
    try {
      if (statut === 'valide') {
        await api.put(`/projets/valider/${id}`, { feedback });
        alert('Projet validé');
      } else {
        await api.put(`/projets/rejeter/${id}`, { feedback });
        alert('Projet rejeté');
      }
      await loadAllData();
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: { background: '#fef3c7', color: iconColors.status.en_attente, text: '⏳ En attente', icon: 'pending' },
      valide: { background: '#d1fae5', color: iconColors.status.validee, text: '✅ Validé', icon: 'check_st' },
      rejete: { background: '#fee2e2', color: iconColors.status.refusee, text: '❌ Rejeté', icon: 'exclamation_point' }
    };
    const b = badges[statut] || { background: '#f3f4f6', color: iconColors.gray, text: statut, icon: 'info' };
    return (
      <span style={{ 
        background: b.background, 
        color: b.color, 
        padding: '4px 12px', 
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
      padding: '30px', 
      maxWidth: '1400px', 
      margin: '0 auto' 
    },
    welcomeSection: {
      background: `linear-gradient(135deg, ${iconColors.primary} 0%, ${iconColors.primaryDark} 100%)`,
      borderRadius: '24px',
      padding: '32px',
      color: iconColors.white,
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    welcomeText: { flex: 1 },
    welcomeTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    welcomeDate: {
      fontSize: '14px',
      opacity: 0.8,
      marginTop: '8px'
    },
    welcomeImage: { 
      height: '80px', 
      borderRadius: '10px',
      objectFit: 'contain'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: iconColors.white,
      padding: '24px',
      borderRadius: '20px',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    statNumber: { 
      fontSize: '36px', 
      fontWeight: 'bold', 
      marginBottom: '8px',
      color: iconColors.black
    },
    statLabel: {
      color: iconColors.gray,
      fontSize: '14px'
    },
    buttonGroup: { 
      display: 'flex', 
      gap: '16px', 
      marginBottom: '30px', 
      flexWrap: 'wrap' 
    },
    actionBtn: { 
      padding: '12px 24px', 
      border: 'none', 
      borderRadius: '12px', 
      cursor: 'pointer', 
      fontWeight: 'bold', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px',
      transition: 'transform 0.2s',
      fontSize: '14px'
    },
    btnPrimary: { background: iconColors.primary, color: iconColors.white },
    btnSuccess: { background: iconColors.secondary, color: iconColors.white },
    btnPurple: { background: iconColors.earlyStage.mois5, color: iconColors.white },
    infoCard: {
      background: iconColors.white,
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    sectionTitle: {
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
    table: { 
      width: '100%', 
      borderCollapse: 'collapse', 
      marginTop: '15px', 
      overflowX: 'auto' 
    },
    th: { 
      padding: '14px', 
      textAlign: 'left', 
      background: iconColors.grayBg, 
      color: iconColors.gray, 
      fontWeight: '600',
      fontSize: '14px',
      borderBottom: `2px solid #e2e8f0`
    },
    td: { 
      padding: '14px', 
      borderBottom: '1px solid #e2e8f0',
      fontSize: '14px'
    },
    btnEdit: { 
      background: iconColors.action.edit, 
      color: iconColors.white, 
      border: 'none', 
      padding: '6px 12px', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      marginRight: '8px', 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px',
      fontSize: '12px'
    },
    btnDelete: { 
      background: iconColors.action.delete, 
      color: iconColors.white, 
      border: 'none', 
      padding: '6px 12px', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      marginRight: '8px', 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px',
      fontSize: '12px'
    },
    btnValidate: { 
      background: iconColors.action.validate, 
      color: iconColors.white, 
      border: 'none', 
      padding: '6px 12px', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      marginRight: '8px', 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px',
      fontSize: '12px'
    },
    btnReject: { 
      background: iconColors.action.reject, 
      color: iconColors.white, 
      border: 'none', 
      padding: '6px 12px', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px',
      fontSize: '12px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px',
      color: iconColors.grayLight
    },
    tabsContainer: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      borderBottom: `1px solid #e2e8f0`,
      paddingBottom: '12px',
      flexWrap: 'wrap'
    },
    tab: (active) => ({
      padding: '10px 20px',
      background: active ? iconColors.primary : 'transparent',
      color: active ? iconColors.white : iconColors.gray,
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    })
  };

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={onLogout} />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Icon name="pending" size={40} color={iconColors.primary} />
          <p style={{ marginTop: '16px', color: iconColors.gray }}>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      <div style={styles.container}>

        {/* Section Bienvenue */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomeText}>
            <div style={styles.welcomeTitle}>
              <Icon name="dashboard_panel" size={32} color={iconColors.white} />
              Tableau de bord Administrateur
            </div>
            <p>Bienvenue, {user?.firstName || 'Administrateur'} {user?.lastName || ''} !</p>
            <p style={styles.welcomeDate}>
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <img 
            src="/img.png" 
            alt="Incubiny" 
            style={styles.welcomeImage} 
            onError={(e) => e.target.style.display = 'none'} 
          />
        </div>

        {/* Timeline Early Stage (version admin) */}
        <EarlyStageTimeline userRole="admin" />

        {/* Onglets */}
        <div style={styles.tabsContainer}>
          <button 
            style={styles.tab(activeTab === 'dashboard')} 
            onClick={() => setActiveTab('dashboard')}
          >
            <Icon name="dashboard_panel" size={16} color={activeTab === 'dashboard' ? iconColors.white : iconColors.gray} />
            Tableau de bord
          </button>
          <button 
            style={styles.tab(activeTab === 'porteurs')} 
            onClick={() => setActiveTab('porteurs')}
          >
            <Icon name="users_alt" size={16} color={activeTab === 'porteurs' ? iconColors.white : iconColors.gray} />
            Porteurs ({porteurs.length})
          </button>
          <button 
            style={styles.tab(activeTab === 'projets')} 
            onClick={() => setActiveTab('projets')}
          >
            <Icon name="business" size={16} color={activeTab === 'projets' ? iconColors.white : iconColors.gray} />
            Projets à valider
          </button>
          <button 
            style={styles.tab(activeTab === 'soumissions')} 
            onClick={() => setActiveTab('soumissions')}
          >
            <Icon name="document" size={16} color={activeTab === 'soumissions' ? iconColors.white : iconColors.gray} />
            Soumissions ({stats.soumissions})
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Statistiques */}
            <div style={styles.statsContainer}>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Icon name="business" size={40} color={iconColors.primary} />
                <div style={styles.statNumber}>{stats.projets}</div>
                <div style={styles.statLabel}>Projets</div>
              </div>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Icon name="users_alt" size={40} color={iconColors.primary} />
                <div style={styles.statNumber}>{stats.porteurs}</div>
                <div style={styles.statLabel}>Porteurs</div>
              </div>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Icon name="exclamation_point" size={40} color={iconColors.warning} />
                <div style={styles.statNumber}>{stats.soumissions}</div>
                <div style={styles.statLabel}>Soumissions en attente</div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div style={styles.buttonGroup}>
              <button 
                onClick={() => setShowCreationPorteur(true)} 
                style={{ ...styles.actionBtn, ...styles.btnPrimary }}
              >
                <Icon name="user_add" size={18} color={iconColors.white} /> Créer un porteur
              </button>
              <button 
                onClick={() => setShowEnvoiTache(true)} 
                style={{ ...styles.actionBtn, ...styles.btnSuccess }}
              >
                <Icon name="send" size={18} color={iconColors.white} /> Envoyer une tâche
              </button>
              <button 
                onClick={() => setShowAssignerEtapes(true)} 
                style={{ ...styles.actionBtn, ...styles.btnPurple }}
              >
                <Icon name="assignment" size={18} color={iconColors.white} /> Assigner programme Early-Stage
              </button>
            </div>

            {/* Calendrier */}
            <Calendrier onEventAdded={loadAllData} />

            {/* Documents à valider */}
            <div id="soumissions">
              <ValidationDocument onValidate={loadAllData} />
            </div>
          </>
        )}

        {activeTab === 'porteurs' && (
          <div style={styles.infoCard}>
            <div style={styles.sectionTitle}>
              <Icon name="users_alt" size={22} color={iconColors.primary} />
              Liste des porteurs
            </div>
            {porteurs.length === 0 ? (
              <div style={styles.emptyState}>
                <Icon name="no_notification" size={48} color={iconColors.grayLight} />
                <p>Aucun porteur créé</p>
                <button 
                  onClick={() => setShowCreationPorteur(true)} 
                  style={{ ...styles.actionBtn, ...styles.btnPrimary, marginTop: '16px' }}
                >
                  <Icon name="user_add" size={16} color={iconColors.white} />
                  Créer un porteur
                </button>
              </div>
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
                          <button 
                            onClick={() => { setSelectedPorteur(p); setShowEditPorteur(true); }} 
                            style={styles.btnEdit}
                          >
                            <Icon name="edit" size={12} color={iconColors.white} /> Modifier
                          </button>
                          <button 
                            onClick={() => handleDeletePorteur(p._id)} 
                            style={styles.btnDelete}
                          >
                            <Icon name="delete" size={12} color={iconColors.white} /> Supprimer
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
            <div style={styles.sectionTitle}>
              <Icon name="business" size={22} color={iconColors.primary} />
              Projets à valider
            </div>
            {projets.filter(p => p.statut === 'en_attente').length === 0 ? (
              <div style={styles.emptyState}>
                <Icon name="check_st" size={48} color={iconColors.grayLight} />
                <p>Aucun projet en attente de validation</p>
              </div>
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
                        <td style={styles.td}>
                          <strong>{p.titre || p.nomProjet}</strong>
                          <br /><span style={{ fontSize: '12px', color: iconColors.gray }}>{p.description?.substring(0, 100)}</span>
                        </td>
                        <td style={styles.td}>{p.porteurId?.firstName} {p.porteurId?.lastName}</td>
                        <td style={styles.td}>{getStatutBadge(p.statut)}</td>
                        <td style={styles.td}>
                          <button 
                            onClick={() => handleValidateProjet(p._id, 'valide', '')} 
                            style={styles.btnValidate}
                          >
                            <Icon name="check_st" size={12} color={iconColors.white} /> Valider
                          </button>
                          <button 
                            onClick={() => {
                              const feedback = prompt('Motif du rejet :');
                              if (feedback) handleValidateProjet(p._id, 'rejete', feedback);
                            }} 
                            style={styles.btnReject}
                          >
                            <Icon name="delete" size={12} color={iconColors.white} /> Rejeter
                          </button>
                          <button 
                            onClick={() => handleDeleteProjet(p._id)} 
                            style={styles.btnDelete}
                          >
                            <Icon name="delete_file" size={12} color={iconColors.white} /> Supprimer
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

        {activeTab === 'soumissions' && (
          <ValidationDocument onValidate={loadAllData} />
        )}
      </div>

      {/* Modals */}
      {showCreationPorteur && (
        <CreationPorteur 
          onClose={() => setShowCreationPorteur(false)} 
          onSuccess={() => { loadAllData(); }} 
        />
      )}
      {showEnvoiTache && (
        <EnvoiTache 
          onClose={() => setShowEnvoiTache(false)} 
          onSuccess={loadAllData} 
        />
      )}
      {showAssignerEtapes && (
        <AssignerEtapes 
          onClose={() => setShowAssignerEtapes(false)} 
          onSuccess={loadAllData} 
        />
      )}
      {showEditPorteur && selectedPorteur && (
        <ModifierPorteur 
          porteur={selectedPorteur} 
          onClose={() => { 
            setShowEditPorteur(false); 
            setSelectedPorteur(null); 
          }} 
          onSuccess={() => { loadAllData(); }} 
        />
      )}
    </div>
  );
}

export default TableauBordAdmin;