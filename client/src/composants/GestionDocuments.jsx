import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from './Icon';

function GestionDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await api.get('/documents/mes-documents');
      setDocuments(res.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, etapeId) => {
    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('etapeId', etapeId);

    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Document uploadé');
      loadDocuments();
    } catch (error) {
      alert('Erreur lors de l\'upload');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer ce document ?')) {
      try {
        await api.delete(`/documents/${id}`);
        loadDocuments();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };
  
  return (
    <div style={{ background: 'white', borderRadius: '15px', padding: '20px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667eea' }}>
        <Icon name="folder_open" size={22} color="#667eea" />
        Mes documents
      </h3>
      {/* Contenu à compléter selon tes besoins */}
    </div>
  );
}

export default GestionDocuments;