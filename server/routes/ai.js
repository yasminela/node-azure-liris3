import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { auth, isAdmin } from '../middlewares/authentification.js';
import AIAnalysis from '../models/AIAnalysis.js';
import Notification from '../models/Notification.js';
import Utilisateur from '../models/Utilisateur.js';
import {
  extraireTextePDF,
  analyserPropositionValeur,
  analyserFaisabilite,
  calculerScoreImpact,
  genererRecommandationsFormations,
  genererFeedbackComplet,
  analyserBMCPDF
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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
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

// ==================== ANALYSE BMC ====================

// POST /api/ai/analyser-bmc
router.post('/analyser-bmc', auth, upload.single('bmc'), async (req, res) => {
  console.log('📥 Route /api/ai/analyser-bmc atteinte !');
  console.log('📎 Fichier reçu:', req.file?.originalname);
  console.log('👤 Porteur ID:', req.user?.id);

  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Aucun fichier PDF fourni' 
      });
    }

    // Utiliser l'analyse complète
    const analyseComplete = await analyserBMCPDF(req.file.path);
    
    if (analyseComplete.erreur) {
      return res.status(400).json({
        success: false,
        message: analyseComplete.erreur,
        suggestion: analyseComplete.formations?.[0] || "Utilisez notre template BMC disponible sur la plateforme"
      });
    }

    // Sauvegarder l'analyse en base
    const analyse = new AIAnalysis({
      porteurId: req.user.id,
      projetId: req.body.projetId || null,
      fichierBMC: req.file.originalname,
      cheminFichier: req.file.path,
      scoreImpact: analyseComplete.scoreImpact,
      niveauImpact: analyseComplete.niveauImpact,
      secteur: analyseComplete.secteur,
      recommandations: analyseComplete.recommandations || [],
      formations: analyseComplete.formations || [],
      feedback: analyseComplete.feedback,
      detailsAnalyse: analyseComplete.detailsAnalyse || {},
      dateAnalyse: new Date()
    });
    
    await analyse.save();
    console.log('💾 Analyse sauvegardée en base avec ID:', analyse._id);

    // Notifier le porteur
    await Notification.create({
      utilisateurId: req.user.id,
      titre: '✅ Analyse IA terminée',
      message: `Votre analyse BMC est terminée. Score: ${analyseComplete.scoreImpact}/100. ${analyseComplete.recommandations?.length || 0} recommandations disponibles.`,
      type: 'succes',
      estLue: false,
      lien: '/#analyses'
    });

    // Notifier les admins avec les formations recommandées
    const admins = await Utilisateur.find({ role: 'admin' });
    for (const admin of admins) {
      let formationsMessage = "";
      if (analyseComplete.formations && analyseComplete.formations.length > 0) {
        formationsMessage = `\n\n📚 Formations recommandées pour ce porteur :\n${analyseComplete.formations.map((f, i) => `${i+1}. ${f}`).join('\n')}`;
      }
      
      await Notification.create({
        utilisateurId: admin._id,
        titre: '📊 Nouvelle analyse BMC à traiter',
        message: `${req.user.firstName} ${req.user.lastName} a soumis son BMC. Score: ${analyseComplete.scoreImpact}/100.${formationsMessage}\n\n👉 Connectez-vous pour voir les détails et recommander des formations.`,
        type: 'info',
        estLue: false,
        lien: '/admin#analyses'
      });
    }

    res.json({
      success: true,
      analyseId: analyse._id,
      scoreImpact: analyseComplete.scoreImpact,
      niveauImpact: analyseComplete.niveauImpact,
      formations: analyseComplete.formations,
      secteur: analyseComplete.secteur,
      feedback: analyseComplete.feedback,
      recommandations: analyseComplete.recommandations,
      detailsAnalyse: analyseComplete.detailsAnalyse
    });

  } catch (error) {
    console.error('❌ Erreur analyse BMC:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// ==================== ROUTES PORTEUR ====================

router.get('/mes-analyses', auth, async (req, res) => {
  try {
    const analyses = await AIAnalysis.find({ porteurId: req.user.id })
      .sort({ dateAnalyse: -1 });
    res.json(analyses);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// ==================== ROUTES ADMIN ====================

router.get('/toutes-les-analyses', auth, isAdmin, async (req, res) => {
  try {
    const analyses = await AIAnalysis.find({})
      .sort({ dateAnalyse: -1 })
      .populate('porteurId', 'firstName lastName email');
    res.json(analyses);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/analyses-porteur/:porteurId', auth, isAdmin, async (req, res) => {
  try {
    const analyses = await AIAnalysis.find({ porteurId: req.params.porteurId })
      .sort({ dateAnalyse: -1 })
      .populate('porteurId', 'firstName lastName email');
    res.json(analyses);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// Envoyer un feedback au porteur (admin)
router.post('/analyse/:id/feedback', auth, isAdmin, async (req, res) => {
  try {
    const { feedback } = req.body;
    const analyse = await AIAnalysis.findById(req.params.id).populate('porteurId');
    
    if (!analyse) {
      return res.status(404).json({ message: 'Analyse non trouvée' });
    }
    
    analyse.feedbackAdmin = feedback;
    analyse.dateFeedback = new Date();
    await analyse.save();
    
    await Notification.create({
      utilisateurId: analyse.porteurId._id,
      titre: '💬 Feedback sur votre analyse BMC',
      message: `Un administrateur a commenté votre analyse BMC. Score: ${analyse.scoreImpact}/100. Feedback: "${feedback.substring(0, 100)}${feedback.length > 100 ? '...' : ''}"`,
      type: 'info',
      estLue: false,
      lien: '/#analyses'
    });
    
    res.json({ success: true, message: 'Feedback envoyé' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// Envoyer des recommandations de formations (admin)
router.post('/envoyer-recommandations', auth, isAdmin, async (req, res) => {
  try {
    const { porteurId, formations } = req.body;
    
    const porteur = await Utilisateur.findById(porteurId);
    if (!porteur) {
      return res.status(404).json({ message: 'Porteur non trouvé' });
    }
    
    let message = `📚 **Recommandations de formations personnalisées**\n\n`;
    message += `Suite à l'analyse de votre BMC, voici les formations recommandées :\n\n`;
    formations.forEach((f, i) => {
      message += `${i+1}. ${f}\n`;
    });
    message += `\n👉 Connectez-vous à votre espace pour plus de détails.`;
    
    await Notification.create({
      utilisateurId: porteurId,
      titre: '📚 Nouvelles formations recommandées',
      message: message,
      type: 'info',
      estLue: false,
      lien: '/#analyses'
    });
    
    res.json({ success: true, message: `${formations.length} formation(s) recommandée(s)` });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;