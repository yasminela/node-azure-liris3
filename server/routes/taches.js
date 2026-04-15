import express from 'express';
import { auth, isAdmin } from '../middlewares/authentification.js';
import Tache from '../models/Tache.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Mes tâches (porteur)
router.get('/mes-taches', auth, async (req, res) => {
  try {
    const taches = await Tache.find({ porteurId: req.user.id });
    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toutes les tâches (admin)
router.get('/toutes', auth, isAdmin, async (req, res) => {
  try {
    const taches = await Tache.find().populate('porteurId', 'firstName lastName email');
    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer une tâche (admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { titre, description, porteurId, dateLimite, type, lienFormulaire } = req.body;
    
    const tache = new Tache({
      titre,
      description,
      porteurId,
      dateLimite: dateLimite ? new Date(dateLimite) : null,
      type: type || 'externe',
      lienFormulaire,
      statut: 'en_attente'
    });
    
    await tache.save();
    
    // Notifier le porteur
    await Notification.create({
      utilisateurId: porteurId,
      titre: 'Nouvelle tâche',
      message: `Une nouvelle tâche "${titre}" vous a été assignée. Date limite: ${dateLimite || 'À définir'}`,
      type: 'info'
    });
    
    res.status(201).json(tache);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Soumettre une tâche (porteur)
router.post('/:id/soumettre', auth, async (req, res) => {
  try {
    const { documentUrl, commentaire } = req.body;
    const tache = await Tache.findByIdAndUpdate(
      req.params.id,
      {
        documentUrl,
        commentairePorteur: commentaire,
        statut: 'soumise',
        dateSoumission: new Date()
      },
      { new: true }
    );
    
    res.json({ message: 'Tâche soumise', tache });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Valider une tâche (admin)
router.post('/:id/valider', auth, isAdmin, async (req, res) => {
  try {
    const { feedback } = req.body;
    const tache = await Tache.findByIdAndUpdate(
      req.params.id,
      {
        statut: 'validee',
        commentaireAdmin: feedback,
        dateValidation: new Date()
      },
      { new: true }
    );
    
    await Notification.create({
      utilisateurId: tache.porteurId,
      titre: 'Tâche validée',
      message: `Votre tâche "${tache.titre}" a été validée. ${feedback || ''}`,
      type: 'succes'
    });
    
    res.json({ message: 'Tâche validée', tache });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Refuser une tâche avec nouvelle date (admin)
router.post('/:id/refuser', auth, isAdmin, async (req, res) => {
  try {
    const { feedback, nouvelleDateLimite } = req.body;
    
    const updateData = {
      statut: 'refusee',
      commentaireAdmin: feedback,
      dateValidation: new Date()
    };
    
    if (nouvelleDateLimite) {
      updateData.dateLimite = new Date(nouvelleDateLimite);
    }
    
    const tache = await Tache.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    await Notification.create({
      utilisateurId: tache.porteurId,
      titre: 'Tâche à reprendre',
      message: `Votre tâche "${tache.titre}" doit être reprise. Feedback: ${feedback}${nouvelleDateLimite ? ` Nouvelle date limite: ${nouvelleDateLimite}` : ''}`,
      type: 'erreur'
    });
    
    res.json({ message: 'Tâche refusée', tache });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
