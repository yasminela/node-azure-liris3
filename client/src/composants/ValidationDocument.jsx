import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from './Icon';  // ✅ AJOUTE CETTE LIGNE

function ValidationDocument() {
  const [soumissions, setSoumissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    loadSoumissions();
  }, []);

  const loadSoumissions = async () => {
    try {
      const res = await api.get('/etapes/soumissions');
      setSoumissions(res.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (id, estValide) => {
    const commentaire = feedback[id] || '';

    if (!estValide && !commentaire) {
      alert('Veuillez ajouter un commentaire pour expliquer le refus');
      return;
    }

    try {
      if (estValide) {
        await api.post(`/etapes/valider/${id}`, { feedback: commentaire });
        alert(' Document validé');
      } else {
        await api.post(`/etapes/refuser/${id}`, { feedback: commentaire });
        alert(' Document refusé');
      }
      loadSoumissions();
      setFeedback({ ...feedback, [id]: '' });
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ background: 'white', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667eea' }}>
        <Icon name="document" size={22} color="#667eea" />
        Documents à valider
      </h3>
      {soumissions.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          <Icon name="no_notification" size={24} color="#ccc" />
          <br />Aucune soumission en attente
        </p>
      ) : (
        soumissions.map(s => (
          <div key={s._id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <strong>{s.titre}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Porteur: {s.porteurId?.firstName} {s.porteurId?.lastName}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Soumis le: {new Date(s.dateSoumission).toLocaleDateString()}
                </div>
                {s.commentairePorteur && (
                  <div style={{ fontSize: '12px', marginTop: '5px', background: '#f0f0f0', padding: '8px', borderRadius: '5px' }}>
                    <strong>Commentaire du porteur:</strong> {s.commentairePorteur}
                  </div>
                )}
                {s.documentUrl && (
                  <div style={{ marginTop: '5px' }}>
                    <a href={`http://localhost:5001/${s.documentUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                      <Icon name="file" size={14} color="#667eea" /> Voir le document
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <textarea
                placeholder="Feedback pour le porteur..."
                value={feedback[s._id] || ''}
                onChange={(e) => setFeedback({ ...feedback, [s._id]: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px' }}
                rows="2"
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleValidation(s._id, true)} 
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Icon name="validate" size={14} color="white" />
                  Valider
                </button>
                <button 
                  onClick={() => handleValidation(s._id, false)} 
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Icon name="reject" size={14} color="white" />
                  Refuser
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ValidationDocument;