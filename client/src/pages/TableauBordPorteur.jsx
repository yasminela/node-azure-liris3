import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../composants/Navbar';
import Calendrier from '../composants/Calendrier';
import SuiviEtapes from '../composants/SuiviEtapes';
import CreerProjet from '../composants/CreerProjet';
import EarlyStageTimeline from '../composants/EarlyStageTimeline';
import PiedDePage from '../composants/PiedDePage';
import Icon from '../composants/Icon';
import { iconColors } from '../styles/iconColors';
import AnalyseBMC from '../composants/AnalyseBMC';

function TableauBordPorteur({ user, onLogout }) {
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [showCreerProjet, setShowCreerProjet] = useState(false);
  const [stats, setStats] = useState({ 
    projetsCount: 0, 
    tachesCount: 0, 
    etapesCount: 0 
  });
  const [loading, setLoading] = useState(true);
  const [showTimelineDetail, setShowTimelineDetail] = useState(null);
  const [etapesValidees, setEtapesValidees] = useState([]);

  useEffect(() => {
    loadData();
    loadEtapesValidees();
  }, []);

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
      setStats({
        projetsCount: projetsRes.data?.length || 0,
        tachesCount: tachesRes.data?.filter(t => !t.estComplete).length || 0,
        etapesCount: etapesRestantes
      });
    } catch (error) {
      console.error('Erreur chargement!', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEtapesValidees = async () => {
    try {
      const res = await api.get('/etapes/mes-etapes');
      const validees = (res.data || [])
        .filter(e => e.statut === 'validee')
        .map(e => e.numero);
      setEtapesValidees(validees);
    } catch (error) {
      console.error('Erreur chargement étapes validées:', error);
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: { icon: 'pending', color: iconColors.status.en_attente, text: 'En attente' },
      valide: { icon: 'check_st', color: iconColors.status.validee, text: 'Validé' },
      rejete: { icon: 'exclamation_point', color: iconColors.status.refusee, text: 'Rejeté' }
    };
    const b = badges[statut] || { icon: 'info', color: iconColors.gray, text: statut };
    return (
      <span style={{ 
        background: b.color, 
        color: iconColors.white, 
        padding: '4px 10px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px' 
      }}>
        <Icon name={b.icon} size={12} color={iconColors.white} /> {b.text}
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
    welcomeSubtitle: {
      opacity: 0.9,
      marginBottom: '8px'
    },
    welcomeDate: {
      fontSize: '14px',
      opacity: 0.8
    },
    welcomeImage: { 
      width: 'clamp(100px, 20%, 250px)',
      height: 'auto',
      maxHeight: '150px', 
      borderRadius: '16px',
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
      transition: 'transform 0.2s, box-shadow 0.2s'
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
    btnPrimary: {
      background: `linear-gradient(135deg, ${iconColors.primary} 0%, ${iconColors.primaryDark} 100%)`,
      color: iconColors.white,
      border: 'none',
      padding: '14px 28px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginBottom: '24px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'transform 0.2s',
      fontSize: '14px'
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
    emptyState: {
      textAlign: 'center',
      padding: '48px',
      color: iconColors.grayLight
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: iconColors.white,
      borderRadius: '20px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: iconColors.primary
    },
    modalCloseBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      float: 'right'
    },
    modalBtn: {
      background: iconColors.primary,
      color: iconColors.white,
      border: 'none',
      padding: '10px 20px',
      borderRadius: '10px',
      cursor: 'pointer',
      marginTop: '20px',
      width: '100%',
      fontWeight: 'bold'
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={onLogout} />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Icon name="pending" size={40} color={iconColors.primary} />
          <p style={{ marginTop: '16px', color: iconColors.gray }}>Chargement de votre espace...</p>
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
              <Icon name="user" size={32} color={iconColors.white} />
              Bienvenue, {user?.firstName || 'Porteur'} {user?.lastName || ''} !
            </div>
            <p style={styles.welcomeSubtitle}>
              Suivez votre progression et déposez vos documents
            </p>
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

        {/* Timeline Early Stage */}
        <EarlyStageTimeline 
          userRole="porteur" 
          etapesValidees={etapesValidees}
          onEtapeClick={(mois) => {
            setShowTimelineDetail(mois);
          }} 
        />

        {/* Statistiques */}
        <div style={styles.statsContainer}>
          <div 
            style={styles.statCard} 
            onClick={() => document.getElementById('mesProjets')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Icon name="folder_open" size={40} color={iconColors.primary} />
            <div style={styles.statNumber}>{stats.projetsCount}</div>
            <div style={styles.statLabel}>Mes projets</div>
          </div>
          <div 
            style={styles.statCard} 
            onClick={() => document.getElementById('mesTaches')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Icon name="task_checklist" size={40} color={iconColors.warning} />
            <div style={styles.statNumber}>{stats.tachesCount}</div>
            <div style={styles.statLabel}>Tâches à faire</div>
          </div>
          <div 
            style={styles.statCard} 
            onClick={() => document.getElementById('suiviEtapes')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Icon name="development" size={40} color={iconColors.secondary} />
            <div style={styles.statNumber}>{stats.etapesCount}</div>
            <div style={styles.statLabel}>Étapes restantes</div>
          </div>
        </div>

        {/* Bouton Nouveau Projet */}
        <button 
          onClick={() => setShowCreerProjet(true)} 
          style={styles.btnPrimary}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Icon name="add_circle" size={20} color={iconColors.white} /> 
          Créer un nouveau projet
        </button>

        {/* Calendrier */}
        <Calendrier />

        {/* Mes Projets */}
        <div id="mesProjets" style={styles.infoCard}>
          <div style={styles.sectionTitle}>
            <Icon name="folder_open" size={22} color={iconColors.primary} />
            Mes projets
          </div>
          {projets.length === 0 ? (
            <div style={styles.emptyState}>
              <Icon name="no_notification" size={48} color={iconColors.grayLight} />
              <p style={{ marginTop: '12px' }}>Vous n'avez pas encore de projet</p>
              <button onClick={() => setShowCreerProjet(true)} style={{ ...styles.btnPrimary, marginTop: '16px', padding: '10px 20px', fontSize: '13px' }}>
                <Icon name="add_circle" size={16} color={iconColors.white} />
                Créer mon premier projet
              </button>
            </div>
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
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Icon name="business" size={16} color={iconColors.primary} />
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
        
<AnalyseBMC 
  onAnalyseComplete={(resultat) => {
    console.log('Analyse terminée:', resultat);
  }}
/>
        {/* Suivi des étapes */}
        <div id="suiviEtapes">
          <SuiviEtapes />
        </div>

        {/* Tâches externes */}
        <div id="mesTaches" style={styles.infoCard}>
          <div style={styles.sectionTitle}>
            <Icon name="task_checklist" size={22} color={iconColors.primary} />
            Tâches externes
          </div>
          {taches.length === 0 ? (
            <div style={styles.emptyState}>
              <Icon name="check_st" size={48} color={iconColors.grayLight} />
              <p style={{ marginTop: '12px' }}>Aucune tâche pour le moment</p>
            </div>
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
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Icon name="assignment" size={16} color={iconColors.primary} />
                          <strong>{t.titre}</strong>
                        </div>
                      </td>
                      <td style={styles.td}>{t.description || '—'}</td>
                      <td style={styles.td}>
                        {t.estComplete ? (
                          <span style={{ 
                            background: '#d1fae5', 
                            color: iconColors.status.validee, 
                            padding: '4px 10px', 
                            borderRadius: '20px', 
                            fontSize: '12px', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '4px' 
                          }}>
                            <Icon name="check_st" size={12} color={iconColors.status.validee} /> Complétée
                          </span>
                        ) : (
                          <span style={{ 
                            background: '#fef3c7', 
                            color: iconColors.status.en_attente, 
                            padding: '4px 10px', 
                            borderRadius: '20px', 
                            fontSize: '12px', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '4px' 
                          }}>
                            <Icon name="pending" size={12} color={iconColors.status.en_attente} /> En cours
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {t.dateLimite ? new Date(t.dateLimite).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pied de page */}
        <PiedDePage />

      </div>

      {/* Modal Créer Projet */}
      {showCreerProjet && (
        <CreerProjet
          onClose={() => setShowCreerProjet(false)}
          onSuccess={loadData}
        />
      )}

      {/* Modal Détail Étape */}
      {showTimelineDetail && (
        <div style={styles.modalOverlay} onClick={() => setShowTimelineDetail(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalCloseBtn} onClick={() => setShowTimelineDetail(null)}>×</button>
            <div style={styles.modalTitle}>
              <Icon name="info" size={22} color={iconColors.primary} />
              Détail - Mois {showTimelineDetail}
            </div>
            <p>Cette étape sera débloquée lorsque les prérequis seront validés.</p>
            <p style={{ marginTop: '12px', color: iconColors.gray, fontSize: '14px' }}>
              Pour accéder à cette étape, vous devez d'abord valider les étapes précédentes.
            </p>
            <button style={styles.modalBtn} onClick={() => setShowTimelineDetail(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableauBordPorteur;