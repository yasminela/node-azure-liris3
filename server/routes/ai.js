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

// Route POST - Analyser BMC
router.post('/analyser-bmc', auth, upload.single('bmc'), async (req, res) => {
  console.log('✅ Route /api/ai/analyser-bmc atteinte !');
  console.log('📎 Fichier reçu:', req.file ? req.file.originalname : 'Aucun');

  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Aucun fichier PDF fourni' 
      });
    }

    // Simulation d'analyse pour tester (remplace plus tard par ton vrai code)
    res.json({
      success: true,
      scoreImpact: 75,
      formations: ["Formation : Impact technologique", "Formation : HealthTech"],
      secteur: { nom: "HealthTech", couleur: "#ef4444", icone: "🏥" },
      feedback: "Bon potentiel d'impact !",
      niveauImpact: "fort"
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

export default router;