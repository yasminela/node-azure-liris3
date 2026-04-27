import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../composants/Navbar';
import Calendrier from '../composants/Calendrier';
import SuiviEtapes from '../composants/SuiviEtapes';
import CreerProjet from '../composants/CreerProjet';
import EarlyStageTimeline from '../composants/EarlyStageTimeline';
import PiedDePage from '../composants/PiedDePage';
import AnalyseBMC from '../composants/AnalyseBMC';
import ScoreProfil from '../composants/ScoreProfil';
import Icon from '../composants/Icon';
import { iconColors } from '../styles/iconColors';

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
  const [historiqueAnalyses, setHistoriqueAnalyses] = useState([]);
  const [selectedAnalyseDetails, setSelectedAnalyseDetails] = useState(null);
  const [showAnalyseModal, setShowAnalyseModal] = useState(false);

  useEffect(() => {
    loadData();
    loadEtapesValidees();
    loadHistoriqueAnalyses();
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

  const loadHistoriqueAnalyses = async () => {
    try {
      const res = await api.get('/ai/mes-analyses');
      setHistoriqueAnalyses(res.data);
    } catch (error) {
      console.error('Erreur chargement historique analyses:', error);
    }
  };

  const voirDetailsAnalyse = (analyse) => {
    setSelectedAnalyseDetails(analyse);
    setShowAnalyseModal(true);
  };

  const supprimerAnalyse = async (analyseId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette analyse ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      await api.delete(`/ai/analyse/${analyseId}`);
      loadHistoriqueAnalyses();
      alert('✅ Analyse supprimée avec succès');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: { icon: 'pending', color: '#f59e0b', text: 'En attente' },
      valide: { icon: 'check_st', color: '#10b981', text: 'Validé' },
      rejete: { icon: 'exclamation_point', color: '#ef4444', text: 'Rejeté' }
    };
    const b = badges[statut] || { icon: 'info', color: '#666', text: statut };
    return (
      <span style={{ 
        background: b.color, 
        color: 'white', 
        padding: '4px 10px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px' 
      }}>
        <Icon name={b.icon} size={12} color="white" /> {b.text}
      </span>
    );
  };

  const styles = {
    container: { padding: '30px', maxWidth: '1400px', margin: '0 auto' },
    welcomeSection: {
      background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
      borderRadius: '24px',
      padding: '32px',
      color: 'white',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    welcomeText: { flex: 1 },
    welcomeTitle: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' },
    welcomeSubtitle: { opacity: 0.9, marginBottom: '8px' },
    welcomeDate: { fontSize: '14px', opacity: 0.8 },
    welcomeImage: { width: '200px', height: 'auto', borderRadius: '16px', objectFit: 'contain' },
    statsContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' },
    statCard: { background: 'white', padding: '24px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer' },
    statNumber: { fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' },
    statLabel: { color: '#64748b', fontSize: '14px' },
    infoCard: { background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
    sectionTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '4px solid #667eea', paddingLeft: '16px' },
    btnPrimary: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '10px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', overflowX: 'auto' },
    th: { padding: '14px', textAlign: 'left', background: '#f8fafc', color: '#475569', fontWeight: '600', fontSize: '14px', borderBottom: '2px solid #e2e8f0' },
    td: { padding: '14px', borderBottom: '1px solid #e2e8f0', fontSize: '14px' },
    emptyState: { textAlign: 'center', padding: '48px', color: '#94a3b8' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '20px', padding: '24px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' },
    modalTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#667eea', display: 'flex', alignItems: 'center', gap: '10px' },
    modalCloseBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', float: 'right' }
  };

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={onLogout} />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Icon name="pending" size={40} color="#667eea" />
          <p>Chargement de votre espace...</p>
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
              <Icon name="user" size={32} color="white" />
              Bienvenue, {user?.firstName || 'Porteur'} {user?.lastName || ''} !
            </div>
            <p style={styles.welcomeSubtitle}>Suivez votre progression et déposez vos documents</p>
            <p style={styles.welcomeDate}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <img src="/img.png" alt="Incubiny" style={styles.welcomeImage} onError={(e) => e.target.style.display = 'none'} />
        </div>

        {/* Score de profil */}
        <ScoreProfil />

        {/* Timeline Early Stage */}
        <EarlyStageTimeline 
          userRole="porteur" 
          etapesValidees={etapesValidees}
          onEtapeClick={(mois) => setShowTimelineDetail(mois)} 
        />

        {/* Analyse d'impact par IA */}
        <AnalyseBMC onAnalyseComplete={() => loadHistoriqueAnalyses()} />

        {/* Statistiques */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}><Icon name="folder_open" size={40} color="#667eea" /><div style={styles.statNumber}>{stats.projetsCount}</div><div style={styles.statLabel}>Mes projets</div></div>
          <div style={styles.statCard}><Icon name="task_checklist" size={40} color="#f59e0b" /><div style={styles.statNumber}>{stats.tachesCount}</div><div style={styles.statLabel}>Tâches à faire</div></div>
          <div style={styles.statCard}><Icon name="development" size={40} color="#10b981" /><div style={styles.statNumber}>{stats.etapesCount}</div><div style={styles.statLabel}>Étapes restantes</div></div>
        </div>

        <button onClick={() => setShowCreerProjet(true)} style={styles.btnPrimary}><Icon name="add_circle" size={20} color="white" /> Créer un nouveau projet</button>
        <Calendrier />

        {/* Mes Projets */}
        <div id="mesProjets" style={styles.infoCard}>
          <div style={styles.sectionTitle}><Icon name="folder_open" size={22} color="#667eea" /> Mes projets</div>
          {projets.length === 0 ? (
            <div style={styles.emptyState}><Icon name="no_notification" size={48} color="#cbd5e1" /><p>Vous n'avez pas encore de projet</p><button onClick={() => setShowCreerProjet(true)} style={{ ...styles.btnPrimary, marginTop: '16px', padding: '10px 20px' }}><Icon name="add_circle" size={16} color="white" /> Créer mon premier projet</button></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Projet</th><th style={styles.th}>Description</th><th style={styles.th}>Statut</th><th style={styles.th}>Date</th></tr></thead>
                <tbody>{projets.map(p => <tr key={p._id}><td style={styles.td}><strong>{p.titre || p.nomProjet}</strong></td><td style={styles.td}>{p.description || '—'}</td><td style={styles.td}>{getStatutBadge(p.statut)}</td><td style={styles.td}>{new Date(p.dateDebut).toLocaleDateString()}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>

        <div id="suiviEtapes"><SuiviEtapes /></div>

        {/* Tâches externes */}
        <div id="mesTaches" style={styles.infoCard}>
          <div style={styles.sectionTitle}><Icon name="task_checklist" size={22} color="#667eea" /> Tâches externes</div>
          {taches.length === 0 ? (
            <div style={styles.emptyState}><Icon name="check_st" size={48} color="#cbd5e1" /><p>Aucune tâche pour le moment</p></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Tâche</th><th style={styles.th}>Description</th><th style={styles.th}>Statut</th><th style={styles.th}>Date limite</th></tr></thead>
                <tbody>{taches.map(t => <tr key={t._id}><td style={styles.td}><strong>{t.titre}</strong></td><td style={styles.td}>{t.description || '—'}</td><td style={styles.td}>{t.estComplete ? <span style={{ background: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>✅ Complétée</span> : <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>⏳ En cours</span>}</td><td style={styles.td}>{t.dateLimite ? new Date(t.dateLimite).toLocaleDateString() : '—'}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>

        {/* Historique des analyses IA */}
        <div style={styles.infoCard}>
          <div style={styles.sectionTitle}><Icon name="history" size={22} color="#667eea" /> Historique de mes analyses</div>
          {historiqueAnalyses.length === 0 ? (
            <div style={styles.emptyState}><Icon name="document" size={48} color="#cbd5e1" /><p>Aucune analyse IA pour le moment</p><p style={{ fontSize: '13px', color: '#94a3b8' }}>Utilisez l'outil "Analyse d'impact par IA" ci-dessus</p></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Fichier</th><th style={styles.th}>Score</th><th style={styles.th}>Secteur</th><th style={styles.th}>Actions</th></tr></thead>
                <tbody>
                  {historiqueAnalyses.map(analyse => (
                    <tr key={analyse._id}>
                      <td style={styles.td}>{new Date(analyse.dateAnalyse).toLocaleDateString()}</td>
                      <td style={styles.td}>{analyse.fichierBMC}</td>
                      <td style={styles.td}><span style={{ background: analyse.scoreImpact < 35 ? '#fee2e2' : analyse.scoreImpact < 65 ? '#fef3c7' : '#d1fae5', color: analyse.scoreImpact < 35 ? '#ef4444' : analyse.scoreImpact < 65 ? '#f59e0b' : '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{analyse.scoreImpact}/100</span></td>
                      <td style={styles.td}>{analyse.secteur?.icone} {analyse.secteur?.nom}</td>
                      <td style={styles.td}>
                        <button onClick={() => voirDetailsAnalyse(analyse)} style={{ background: '#667eea', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>Détails</button>
                        <button onClick={() => supprimerAnalyse(analyse._id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <PiedDePage />
      </div>

      {/* Modals */}
      {showCreerProjet && <div style={styles.modalOverlay} onClick={() => setShowCreerProjet(false)}><div style={styles.modalContent} onClick={(e) => e.stopPropagation()}><CreerProjet onClose={() => setShowCreerProjet(false)} onSuccess={loadData} /></div></div>}
      {showTimelineDetail && <div style={styles.modalOverlay} onClick={() => setShowTimelineDetail(null)}><div style={styles.modalContent} onClick={(e) => e.stopPropagation()}><button style={styles.modalCloseBtn} onClick={() => setShowTimelineDetail(null)}>×</button><div style={styles.modalTitle}><Icon name="info" size={22} color="#667eea" /> Détail - Mois {showTimelineDetail}</div><p>Cette étape sera débloquée lorsque les prérequis seront validés.</p><button onClick={() => setShowTimelineDetail(null)} style={{ background: '#667eea', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginTop: '20px', width: '100%' }}>Fermer</button></div></div>}
      {showAnalyseModal && selectedAnalyseDetails && <div style={styles.modalOverlay} onClick={() => setShowAnalyseModal(false)}><div style={styles.modalContent} onClick={(e) => e.stopPropagation()}><button style={styles.modalCloseBtn} onClick={() => setShowAnalyseModal(false)}>×</button><div style={styles.modalTitle}><Icon name="brain" size={22} color="#667eea" /> Détails analyse</div><div><strong>Date:</strong> {new Date(selectedAnalyseDetails.dateAnalyse).toLocaleString()}</div><div><strong>Fichier:</strong> {selectedAnalyseDetails.fichierBMC}</div><div><strong>Score:</strong> {selectedAnalyseDetails.scoreImpact}/100</div><div><strong>Secteur:</strong> {selectedAnalyseDetails.secteur?.icone} {selectedAnalyseDetails.secteur?.nom}</div><div><strong>Feedback:</strong> {selectedAnalyseDetails.feedback}</div><div><strong>Formations:</strong></div><ul>{selectedAnalyseDetails.formations?.map((f, i) => <li key={i}>{f}</li>)}</ul><button onClick={() => setShowAnalyseModal(false)} style={{ background: '#667eea', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginTop: '20px', width: '100%' }}>Fermer</button></div></div>}
    </div>
  );
}

export default TableauBordPorteur;