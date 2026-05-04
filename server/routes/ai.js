import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { auth, isAdmin } from '../middlewares/authentification.js';
import AIAnalysis from '../models/AIAnalysis.js';
import Notification from '../models/Notification.js';
import Utilisateur from '../models/Utilisateur.js';
import Evenement from '../models/Evenement.js';
import Formation from '../models/Formation.js';
import Etape from '../models/Etape.js';
import {
  extraireTextePDF,
  calculerScoreImpact,
  recommanderFormations,
  recommanderEvenements,
  analyserSecteur,
  genererFeedback
} from '../services/aiService.js';

const router = express.Router();

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './telechargements/ia';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()  * 1E9);
    cb(null, 'bmc-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont acceptés'));
    }
  }
});

// Vérifier les retards des porteurs (tous les jours)
const verifierRetards = async () => {
  console.log('🔍 Vérification des retards des porteurs...');
  
  try {
    const porteurs = await Utilisateur.find({ role: 'porteur' });
    
    for (const porteur of porteurs) {
      // Récupérer les étapes non soumises avec date dépassée
      const etapesEnRetard = await Etape.find({
        porteurId: porteur._id,
        statut: { $in: ['en_attente', 'en_cours'] },
        dateLimite: { $lt: new Date() }
      });
      
      if (etapesEnRetard.length > 0) {
        // Notifier le porteur
        await Notification.create({
          utilisateurId: porteur._id,
          titre: '⚠️ Retard dans vos soumissions',
          message: `Vous avez ${etapesEnRetard.length} étape(s) en retard. Merci de les soumettre rapidement.`,
          type: 'warning',
          estLue: false,
          lien: '/etapes'
        });
        
        // Notifier les admins
        const admins = await Utilisateur.find({ role: 'admin' });
        for (const admin of admins) {
          await Notification.create({
            utilisateurId: admin._id,
            titre: '⚠️ Porteur en retard',
            message: `${porteur.firstName} ${porteur.lastName} a ${etapesEnRetard.length} étape(s) en retard.`,
            type: 'warning',
            estLue: false,
            lien: '/admin#porteurs'
          });
        }
      }
    }
  } catch (error) {
    console.error('Erreur vérification retards:', error);
  }
};

// Lancer la vérification tous les jours à 9h
const scheduleRetardCheck = () => {
  const now = new Date();
  const next9am = new Date();
  next9am.setHours(9, 0, 0, 0);
  if (now > next9am) next9am.setDate(next9am.getDate() + 1);
  
  const delay = next9am - now;
  setTimeout(() => {
    verifierRetards();
    setInterval(verifierRetards, 24 * 60 * 60 * 1000);
  }, delay);
};

scheduleRetardCheck();

// POST /api/ai/analyser-bmc
router.post('/analyser-bmc', auth, upload.single('bmc'), async (req, res) => {
  console.log('✅ Route /api/ai/analyser-bmc atteinte !');
  console.log('📎 Fichier reçu:', req.file?.originalname);

  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Aucun fichier PDF fourni' 
      });
    }

    // Extraire le texte du PDF
    let texteBMC = "";
    try {
      texteBMC = await extraireTextePDF(req.file.path);
    } catch (error) {
      console.error('Erreur extraction texte:', error);
      texteBMC = "";
    }
    
    // Calculer l'analyse
    const score = calculerScoreImpact(texteBMC);
    const formations = recommanderFormations(score, texteBMC);
    const evenements = recommanderEvenements(score, texteBMC);
    const secteur = analyserSecteur(texteBMC);
    const feedback = genererFeedback(score, secteur);
    const niveauImpact = score < 35 ? 'faible' : score < 65 ? 'moyen' : 'fort';

    // Sauvegarder l'analyse
    const analyse = new AIAnalysis({
      porteurId: req.user.id,
      projetId: req.body.projetId || null,
      fichierBMC: req.file.originalname,
      cheminFichier: req.file.path,
      scoreImpact: score,
      niveauImpact: niveauImpact,
      secteur: secteur,
      formations: formations,
      evenementsRecommandes: evenements,
      feedback: feedback,
      dateAnalyse: new Date()
    });
    
    await analyse.save();
    console.log('💾 Analyse sauvegardée en base');

    // Notifier le porteur que l'analyse est terminée
    await Notification.create({
      utilisateurId: req.user.id,
      titre: '✅ Analyse IA terminée',
      message: `Votre analyse BMC est terminée. Score: ${score}/100. Consultez vos recommandations.`,
      type: 'success',
      estLue: false,
      lien: '/#analyses'
    });

    // Notifier les admins
    const admins = await Utilisateur.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        utilisateurId: admin._id,
        titre: '📊 Nouvelle analyse IA',
        message: `${req.user.firstName} ${req.user.lastName} a soumis une analyse BMC. Score: ${score}/100`,
        type: 'info',
        estLue: false,
        lien: '/admin#analyses'
      });
    }

    // Créer des événements recommandés si besoin
    for (const eventData of evenements) {
      const eventExistant = await Evenement.findOne({ 
        titre: eventData.titre,
        dateDebut: new Date(eventData.date)
      });
      
      if (!eventExistant) {
        await Evenement.create({
          titre: eventData.titre,
          description: eventData.description,
          type: eventData.type || 'formation',
          dateDebut: new Date(eventData.date),
          dateFin: new Date(eventData.dateFin || eventData.date),
          lieu: eventData.lieu || 'En ligne',
          porteursAssignes: [req.user.id],
          estPublic: false
        });
      } else {
        // Ajouter le porteur à l'événement existant
        if (!eventExistant.porteursAssignes.includes(req.user.id)) {
          eventExistant.porteursAssignes.push(req.user.id);
          await eventExistant.save();
        }
      }
    }

    res.json({
      success: true,
      analyseId: analyse._id,
      scoreImpact: score,
      formations: formations,
      evenements: evenements,
      secteur: secteur,
      feedback: feedback,
      niveauImpact: niveauImpact
    });

  } catch (error) {
    console.error('❌ Erreur analyse BMC:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Récupérer l'historique des analyses du porteur
router.get('/mes-analyses', auth, async (req, res) => {
  try {
    const analyses = await AIAnalysis.find({ porteurId: req.user.id })
      .sort({ dateAnalyse: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer toutes les analyses (admin)
router.get('/toutes-les-analyses', auth, isAdmin, async (req, res) => {
  try {
    const analyses = await AIAnalysis.find({})
      .sort({ dateAnalyse: -1 })
      .populate('porteurId', 'firstName lastName email');
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer une analyse
router.delete('/analyse/:id', auth, async (req, res) => {
  try {
    const analyse = await AIAnalysis.findById(req.params.id);
    
    if (!analyse) {
      return res.status(404).json({ success: false, message: 'Analyse non trouvée' });
    }
    
    const isAdminUser = req.user.role === 'admin';
    const isOwner = analyse.porteurId.toString() === req.user.id;
    
    if (!isAdminUser && !isOwner) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }
    
    if (analyse.cheminFichier && fs.existsSync(analyse.cheminFichier)) {
      try {
        fs.unlinkSync(analyse.cheminFichier);
      } catch (fileError) {
        console.log('⚠️ Fichier non trouvé:', fileError.message);
      }
    }
    
    await AIAnalysis.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Analyse supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Envoyer un feedback au porteur (admin)
router.post('/analyse/:id/feedback', auth, isAdmin, async (req, res) => {
  try {
    const { feedback } = req.body;
    const analyse = await AIAnalysis.findById(req.params.id);
    
    if (!analyse) {
      return res.status(404).json({ message: 'Analyse non trouvée' });
    }
    
    analyse.feedbackAdmin = feedback;
    analyse.dateFeedback = new Date();
    await analyse.save();
    
    await Notification.create({
      utilisateurId: analyse.porteurId,
      titre: '💬 Feedback sur votre analyse IA',
      message: `Un administrateur a commenté votre analyse BMC. Feedback: "${feedback}"`,
      type: 'info',
      estLue: false,
      lien: '/#analyses'
    });
    
    res.json({ success: true, message: 'Feedback envoyé au porteur' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Générer un rapport PDF (récupérer les données)
router.get('/analyse/:id/rapport', auth, async (req, res) => {
  try {
    const analyse = await AIAnalysis.findById(req.params.id)
      .populate('porteurId', 'firstName lastName email');
    
    if (!analyse) {
      return res.status(404).json({ message: 'Analyse non trouvée' });
    }
    
    // Vérifier les droits (admin ou propriétaire)
    const isAdminUser = req.user.role === 'admin';
    const isOwner = analyse.porteurId._id.toString() === req.user.id;
    
    if (!isAdminUser && !isOwner) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    res.json({
      success: true,
      analyse: {
        id: analyse._id,
        date: analyse.dateAnalyse,
        porteur: analyse.porteurId,
        fichier: analyse.fichierBMC,
        score: analyse.scoreImpact,
        niveau: analyse.niveauImpact,
        secteur: analyse.secteur,
        formations: analyse.formations,
        feedbackIA: analyse.feedback,
        feedbackAdmin: analyse.feedbackAdmin
      }
    });
  } catch (error) {
    console.error('Erreur génération rapport:', error);
    res.status(500).json({ message: error.message });
  }
});
export default router;