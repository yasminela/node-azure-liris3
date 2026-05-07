import express from 'express';
import { auth, isAdmin } from '../middlewares/authentification.js';
import Projet from '../models/Projet.js';
import Notification from '../models/Notification.js';
import Utilisateur from '../models/Utilisateur.js';

const router = express.Router();

// ==================== ROUTES PORTEUR ====================

// Mes projets (porteur)
router.get('/mes-projets', auth, async (req, res) => {
  try {
    const projets = await Projet.find({ porteurId: req.user.id }).sort({ dateDebut: -1 });
    res.json(projets);
  } catch (error) {
    console.error('Erreur chargement projets porteur:', error);
    res.status(500).json({ message: error.message });
  }
});

// Créer un projet
router.post('/', auth, async (req, res) => {
  try {
    const { titre, description, secteur, budget } = req.body;
    
    const projet = new Projet({
      titre,
      description,
      secteur,
      budget: budget ? parseInt(budget) : 0,
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
    console.error('Erreur création projet:', error);
    res.status(500).json({ message: error.message });
  }
});

// Modifier un projet (porteur)
router.put('/:id', auth, async (req, res) => {
  try {
    const { titre, description, secteur, budget } = req.body;
    
    const projet = await Projet.findOne({
      _id: req.params.id,
      porteurId: req.user.id
    });
    
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    // Ne pas modifier si déjà validé ou rejeté
    if (projet.statut !== 'en_attente') {
      return res.status(400).json({ message: 'Ce projet ne peut plus être modifié car il a déjà été traité' });
    }
    
    projet.titre = titre || projet.titre;
    projet.description = description || projet.description;
    projet.secteur = secteur || projet.secteur;
    projet.budget = budget ? parseInt(budget) : projet.budget;
    
    await projet.save();
    
    res.json(projet);
  } catch (error) {
    console.error('Erreur modification projet:', error);
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un projet (porteur)
router.delete('/:id', auth, async (req, res) => {
  try {
    const projet = await Projet.findOne({
      _id: req.params.id,
      porteurId: req.user.id
    });
    
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    // Ne supprimer que les projets en attente
    if (projet.statut !== 'en_attente') {
      return res.status(400).json({ message: 'Ce projet ne peut plus être supprimé car il a déjà été traité' });
    }
    
    await Projet.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression projet:', error);
    res.status(500).json({ message: error.message });
  }
});

// Détail d'un projet
router.get('/:id', auth, async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id).populate('porteurId', 'firstName lastName email telephone');
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    // Vérifier les droits
    const isOwner = projet.porteurId._id.toString() === req.user.id;
    const isAdminUser = req.user.role === 'admin';
    
    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(projet);
  } catch (error) {
    console.error('Erreur chargement projet:', error);
    res.status(500).json({ message: error.message });
  }
});

// ==================== ROUTES ADMIN ====================

// Tous les projets (admin)
router.get('/tous', auth, isAdmin, async (req, res) => {
  try {
    const projets = await Projet.find()
      .populate('porteurId', 'firstName lastName email telephone')
      .sort({ dateDebut: -1 });
    res.json(projets);
  } catch (error) {
    console.error('Erreur chargement tous projets:', error);
    res.status(500).json({ message: error.message });
  }
});

// Projets en attente (admin)
router.get('/en-attente', auth, isAdmin, async (req, res) => {
  try {
    const projets = await Projet.find({ statut: 'en_attente' })
      .populate('porteurId', 'firstName lastName email telephone');
    res.json(projets);
  } catch (error) {
    console.error('Erreur chargement projets en attente:', error);
    res.status(500).json({ message: error.message });
  }
});

// Valider un projet (admin)
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

    await Notification.create({
      utilisateurId: projet.porteurId._id,
      titre: '✅ Projet validé',
      message: `Votre projet "${projet.titre}" a été validé par l'administrateur.${feedback ? ` Feedback: ${feedback}` : ''}`,
      type: 'succes',
      estLue: false,
      lien: '/'
    });

    res.json({ success: true, message: 'Projet validé avec succès', projet });
  } catch (error) {
    console.error('Erreur validation projet:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rejeter un projet (admin)
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
    
    await Notification.create({
      utilisateurId: projet.porteurId._id,
      titre: '❌ Projet non retenu',
      message: `Votre projet "${projet.titre}" n'a pas été retenu. Feedback: ${feedback}`,
      type: 'erreur',
      estLue: false,
      lien: '/'
    });

    res.json({ success: true, message: 'Projet rejeté', projet });
  } catch (error) {
    console.error('Erreur rejet projet:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;