import express from 'express';
import { auth, isAdmin } from '../middlewares/authentification.js';
import Projet from '../models/Projet.js';
import Notification from '../models/Notification.js';
import Utilisateur from '../models/Utilisateur.js';

const router = express.Router();

// Mes projets (porteur)
router.get('/mes-projets', auth, async (req, res) => {
  try {
    const projets = await Projet.find({ porteurId: req.user.id });
    res.json(projets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tous les projets (admin)
router.get('/tous', auth, isAdmin, async (req, res) => {
  try {
    const projets = await Projet.find().populate('porteurId', 'firstName lastName email telephone');
    res.json(projets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un projet
router.post('/', auth, async (req, res) => {
  try {
    const projet = new Projet({
      ...req.body,
      porteurId: req.user.id,
      statut: 'en_attente',
      dateDebut: new Date()
    });
    await projet.save();

    // Notifier les admins
    const admins = await Utilisateur.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        utilisateurId: admin._id,
        titre: '📋 Nouveau projet en attente',
        message: `Le porteur ${req.user.firstName} ${req.user.lastName} a soumis un nouveau projet : ${projet.titre}`,
        type: 'info',
        estLue: false,
        lien: '/admin#projets'
      });
    }

    res.status(201).json(projet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ VALIDER un projet (admin)
router.put('/valider/:id', auth, isAdmin, async (req, res) => {
  try {
    const { feedback } = req.body;
    
    const projet = await Projet.findByIdAndUpdate(
      req.params.id,
      { 
        statut: 'valide',
        feedback: feedback || '',
        dateValidation: new Date()
      },
      { new: true }
    ).populate('porteurId', 'firstName lastName email');

    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Notifier le porteur
    await Notification.create({
      utilisateurId: projet.porteurId._id,
      titre: ' Projet validé',
      message: `Votre projet "${projet.titre}" a été validé par l'administrateur.${feedback ? ` Feedback: ${feedback}` : ''}`,
      type: 'succes',
      estLue: false,
      lien: '/'
    });

    res.json({ message: 'Projet validé avec succès', projet });
  } catch (error) {
    console.error('Erreur validation:', error);
    res.status(500).json({ message: error.message });
  }
});

//  REJETER un projet (admin)
router.put('/rejeter/:id', auth, isAdmin, async (req, res) => {
  try {
    const { feedback } = req.body;
    
    if (!feedback) {
      return res.status(400).json({ message: 'Un feedback est requis pour rejeter le projet' });
    }

    const projet = await Projet.findByIdAndUpdate(
      req.params.id,
      { 
        statut: 'rejete',
        feedback: feedback,
        dateRejet: new Date()
      },
      { new: true }
    ).populate('porteurId', 'firstName lastName email');

    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    // Notifier le porteur
    await Notification.create({
      utilisateurId: projet.porteurId._id,
      titre: 'Projet non retenu',
      message: `Votre projet "${projet.titre}" n'a pas été retenu. Feedback: ${feedback}`,
      type: 'erreur',
      estLue: false,
      lien: '/'
    });

    res.json({ message: 'Projet rejeté', projet });
  } catch (error) {
    console.error('Erreur rejet:', error);
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un projet (admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
