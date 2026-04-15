import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function EnvoiTache({ onClose, onSuccess }) {
  const [porteurs, setPorteurs] = useState([]);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    porteurId: '',
    dateLimite: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPorteurs();
  }, []);

  const loadPorteurs = async () => {
    try {
      const res = await api.get('/utilisateurs');
      setPorteurs(res.data.filter(u => u.role === 'porteur'));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/taches', formData);
      alert(' Tâche envoyée');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      alert(' Erreur: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '30px', maxWidth: '500px', width: '90%' }}>
        <h2 style={{ marginBottom: '20px', color: '#667eea' }}>📧 Envoyer une tâche</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Titre" value={formData.titre} onChange={(e) => setFormData({...formData, titre: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
          <select value={formData.porteurId} onChange={(e) => setFormData({...formData, porteurId: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <option value="">Sélectionner un porteur</option>
            {porteurs.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName} ({p.email})</option>)}
          </select>
          <input type="date" value={formData.dateLimite} onChange={(e) => setFormData({...formData, dateLimite: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} style={{ background: '#667eea', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{loading ? 'Envoi...' : 'Envoyer'}</button>
            <button type="button" onClick={onClose} style={{ background: '#e2e8f0', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnvoiTache;