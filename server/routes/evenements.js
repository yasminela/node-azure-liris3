import express from 'express';
import { auth, isAdmin } from '../middlewares/authentification.js';
import Evenement from '../models/Evenement.js';

const router = express.Router();

// Créer un événement (admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const event = new Evenement(req.body);
    await event.save();
    res.status(201).json({ message: 'Événement créé', evenement: event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mes événements (porteur)
router.get('/mes-evenements', auth, async (req, res) => {
  try {
    const events = await Evenement.find({
      $or: [{ estPublic: true }, { porteursAssignes: req.user.id }]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tous les événements (admin)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const events = await Evenement.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un événement
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Evenement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Événement supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
