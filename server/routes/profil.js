import express from 'express';
import { auth, isAdmin } from '../middlewares/authentification.js';
import { calculerScoreProfil, getDetailsScore, getAllPorteursScores, verifierProfilsIncomplets } from '../services/profilService.js';

const router = express.Router();

// Obtenir mon score de profil (porteur)
router.get('/mon-score', auth, async (req, res) => {
  try {
    const score = await calculerScoreProfil(req.user.id);
    res.json({ score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir le détail du score (porteur)
router.get('/details-score', auth, async (req, res) => {
  try {
    const details = await getDetailsScore(req.user.id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir tous les scores des porteurs (admin)
router.get('/tous-scores', auth, isAdmin, async (req, res) => {
  try {
    const scores = await getAllPorteursScores();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vérifier tous les profils (admin)
router.post('/verifier', auth, isAdmin, async (req, res) => {
  try {
    await verifierProfilsIncomplets();
    res.json({ success: true, message: 'Vérification effectuée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;