import express from 'express';
import { auth, isAdmin } from '../middlewares/authentification.js';
import Notification from '../models/Notification.js';
import Utilisateur from '../models/Utilisateur.js';

const router = express.Router();

// Mes notifications (porteur + admin)
router.get('/mes-notifications', auth, async (req, res) => {
  try {
    const notifs = await Notification.find({ utilisateurId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Marquer comme lue
router.put('/:id/lire', auth, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id, 
      { estLue: true }, 
      { new: true }
    );
    res.json(notif);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tout marquer comme lu
router.put('/tout-lire', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { utilisateurId: req.user.id, estLue: false },
      { estLue: true }
    );
    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Envoyer un rapport d'analyse à l'admin
router.post('/send-report', auth, async (req, res) => {
  console.log('📥 /send-report appelé');
  
  try {
    const { projetId, resultat, fichierBMC } = req.body;
    console.log('📊 Score reçu:', resultat?.scoreImpact);
    
    const porteur = await Utilisateur.findById(req.user.id);
    if (!porteur) {
      return res.status(404).json({ message: 'Porteur non trouvé' });
    }
    
    const admins = await Utilisateur.find({ role: 'admin' });
    console.log(`👨‍💼 ${admins.length} admin(s) trouvé(s)`);
    
    for (const admin of admins) {
      await Notification.create({
        utilisateurId: admin._id,
        titre: "📊 Nouveau rapport d'analyse IA",
        message: `${porteur.firstName} ${porteur.lastName} a soumis un BMC. Score: ${resultat.scoreImpact}/100`,
        type: 'info',
        estLue: false,
        lien: '/admin#analyses',
        data: {
          porteurId: porteur._id,
          porteurNom: `${porteur.firstName} ${porteur.lastName}`,
          porteurEmail: porteur.email,
          scoreImpact: resultat.scoreImpact,
          niveauImpact: resultat.niveauImpact,
          secteur: resultat.secteur,
          formations: resultat.formations,
          feedback: resultat.feedback,
          fichierBMC: fichierBMC,
          dateAnalyse: new Date()
        }
      });
      console.log(`✅ Notification créée pour ${admin.email}`);
    }
    
    res.json({ success: true, message: 'Rapport envoyé' });
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// Récupérer tous les rapports d'analyse (admin seulement)
router.get('/analyses', auth, isAdmin, async (req, res) => {
  try {
    const analyses = await Notification.find({ 
      'data.scoreImpact': { $exists: true } 
    }).sort({ createdAt: -1 }).populate('utilisateurId', 'firstName lastName email');
    
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ajouter un feedback admin à une analyse
router.post('/analyses/:id/feedback', auth, isAdmin, async (req, res) => {
  try {
    const { feedback, porteurId } = req.body;
    
    await Notification.findByIdAndUpdate(
      req.params.id,
      { feedbackAdmin: feedback },
      { new: true }
    );
    
    await Notification.create({
      utilisateurId: porteurId,
      titre: "📋 Nouveau feedback sur votre analyse IA",
      message: `L'administrateur a ajouté un feedback à votre analyse d'impact.`,
      type: 'info',
      estLue: false,
      lien: '/#analyse'
    });
    
    res.json({ success: true, message: 'Feedback envoyé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
