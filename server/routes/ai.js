import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { auth } from '../middlewares/authentification.js';
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
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        erreur: 'Aucun fichier PDF fourni' 
      });
    }

    const texteBMC = await extraireTextePDF(req.file.path);
    
    if (!texteBMC || texteBMC.length < 50) {
      return res.status(400).json({ 
        success: false,
        erreur: 'Le PDF ne contient pas assez de texte exploitable',
        scoreImpact: 0,
        formations: ["Formation : Définir son impact technologique"]
      });
    }

    const score = calculerScoreImpact(texteBMC);
    const formations = recommanderFormations(score, texteBMC);
    const secteur = analyserSecteur(texteBMC);
    const feedback = genererFeedback(score, secteur);

    // Nettoyage du fichier temporaire (optionnel)
    // fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      scoreImpact: score,
      formations: formations,
      secteur: secteur,
      feedback: feedback,
      niveauImpact: score < 35 ? 'faible' : score < 65 ? 'moyen' : 'fort'
    });

  } catch (error) {
    console.error('Erreur analyse BMC:', error);
    res.status(500).json({ 
      success: false,
      erreur: error.message,
      scoreImpact: 0,
      formations: ["Formation : Définir son impact technologique"]
    });
  }
});

export default router;