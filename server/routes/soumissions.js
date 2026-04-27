import express from 'express';
import { auth, isAdmin } from '../middlewares/authentification.js';
import { 
  verifierSoumissionsProches, 
  verifierSoumissionsRetard, 
  calculerScorePonctualite,
  creerSoumission,
  marquerSoumise
} from '../services/soumissionService.js';
import Soumission from '../models/Soumission.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Vérifier toutes les soumissions (à exécuter périodiquement)
router.post('/verifier-toutes', auth, isAdmin, async (req, res) => {
  try {
    await verifierSoumissionsProches();
    await verifierSoumissionsRetard();
    res.json({ success: true, message: 'Vérification effectuée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir le score de ponctualité du porteur
router.get('/score-ponctualite', auth, async (req, res) => {
  try {
    const score = await calculerScorePonctualite(req.user.id);
    res.json({ score, niveau: score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : 'À améliorer' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir toutes les soumissions du porteur
router.get('/mes-soumissions', auth, async (req, res) => {
  try {
    const soumissions = await Soumission.find({ porteurId: req.user.id })
      .sort({ dateLimite: 1 });
    res.json(soumissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer une soumission (admin ou automatique)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { porteurId, titre, dateLimite, etapeId, tacheId } = req.body;
    const soumission = await creerSoumission(porteurId, titre, dateLimite, etapeId, tacheId);
    res.json(soumission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Marquer une soumission comme faite
router.put('/:id/soumettre', auth, async (req, res) => {
  try {
    const soumission = await marquerSoumise(req.params.id);
    if (!soumission) {
      return res.status(404).json({ message: 'Soumission non trouvée' });
    }
    res.json(soumission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;