import express from 'express';
import { auth, isAdmin } from '../middlewares/authentification.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Mes notifications
router.get('/mes-notifications', auth, async (req, res) => {
  try {
    const notifs = await Notification.find({ utilisateurId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Marquer comme lue
router.put('/:id/lire', auth, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { estLue: true }, { new: true });
    res.json(notif);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
