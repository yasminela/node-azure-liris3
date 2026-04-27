import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { auth, isAdmin } from '../middlewares/authentification.js';
import AIAnalysis from '../models/AIAnalysis.js';
import {
  extraireTextePDF,
  calculerScoreImpact,
  recommanderFormations,
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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'bmc-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont acceptés'));
    }
  }
});

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

    const texteBMC = await extraireTextePDF(req.file.path);
    
    const score = calculerScoreImpact(texteBMC);
    const formations = recommanderFormations(score, texteBMC);
    const secteur = analyserSecteur(texteBMC);
    const feedback = genererFeedback(score, secteur);
    const niveauImpact = score < 35 ? 'faible' : score < 65 ? 'moyen' : 'fort';

    const analyse = new AIAnalysis({
      porteurId: req.user.id,
      projetId: req.body.projetId || null,
      fichierBMC: req.file.originalname,
      cheminFichier: req.file.path,
      scoreImpact: score,
      niveauImpact: niveauImpact,
      secteur: secteur,
      formations: formations,
      feedback: feedback,
      dateAnalyse: new Date()
    });
    
    await analyse.save();
    console.log('💾 Analyse sauvegardée en base');

    res.json({
      success: true,
      scoreImpact: score,
      formations: formations,
      secteur: secteur,
      feedback: feedback,
      niveauImpact: niveauImpact,
      analyseId: analyse._id
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

// Récupérer toutes les analyses (admin seulement)
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

// ✅ SUPPRIMER UNE ANALYSE (admin ou porteur propriétaire)
// Supprimer une analyse
router.delete('/analyse/:id', auth, async (req, res) => {
  console.log('🗑️ DELETE /analyse/:id appelé');
  console.log('ID:', req.params.id);
  console.log('Utilisateur:', req.user?.id, req.user?.role);
  
  try {
    const analyse = await AIAnalysis.findById(req.params.id);
    
    if (!analyse) {
      console.log('❌ Analyse non trouvée');
      return res.status(404).json({ success: false, message: 'Analyse non trouvée' });
    }
    
 // Vérifier les droits
    const isAdmin = req.user.role === 'admin';
    const isOwner = analyse.porteurId.toString() === req.user.id;
    
    if (!isAdmin && !isOwner) {
      console.log('❌ Non autorisé');
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    // Vérifier si l'utilisateur est admin ou propriétaire
    if (req.user.role !== 'admin' && analyse.porteurId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
     // Supprimer le fichier PDF
    if (analyse.cheminFichier) {
      try {
        fs.unlinkSync(analyse.cheminFichier);
        console.log('📄 Fichier supprimé:', analyse.cheminFichier);
      } catch (fileError) {
        console.log('⚠️ Fichier non trouvé:', fileError.message);
      }
    }
    
    await AIAnalysis.findByIdAndDelete(req.params.id);
    console.log('✅ Analyse supprimée');
    
    res.json({ success: true, message: 'Analyse supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Récupérer une analyse spécifique
router.get('/analyse/:id', auth, async (req, res) => {
  try {
    const analyse = await AIAnalysis.findOne({ 
      _id: req.params.id,
      porteurId: req.user.id
    });
    if (!analyse) {
      return res.status(404).json({ message: 'Analyse non trouvée' });
    }
    res.json(analyse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;