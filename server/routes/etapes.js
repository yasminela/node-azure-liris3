import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { auth, isAdmin } from '../middlewares/authentification.js';
import Etape from '../models/Etape.js';
import Notification from '../models/Notification.js';
import Utilisateur from '../models/Utilisateur.js';
import { etapesEarlyStage } from '../data/etapesPredefinies.js';

const router = express.Router();

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './telechargements';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Assigner les étapes Early-Stage (admin)
router.post('/assigner-early-stage', auth, isAdmin, async (req, res) => {
  try {
    const { porteurId, projetId } = req.body;
    
    if (!porteurId || !projetId) {
      return res.status(400).json({ message: 'Porteur et projet requis' });
    }
    
    await Etape.deleteMany({ porteurId: porteurId, type: 'early-stage' });
    
    for (const etape of etapesEarlyStage) {
      await Etape.create({
        porteurId: porteurId,
        projetId: projetId,
        numero: etape.numero,
        titre: etape.titre,
        description: etape.description,
        mois: etape.mois,
        documentRequis: etape.documentRequis,
        type: 'early-stage',
        statut: 'en_attente'
      });
    }
    
    await Notification.create({
      utilisateurId: porteurId,
      titre: 'Programme Early-Stage assigné',
      message: `Le programme Early-Stage (${etapesEarlyStage.length} étapes) vous a été assigné.`,
      type: 'info',
      estLue: false,
      lien: '/'
    });
    
    res.json({ success: true, message: `${etapesEarlyStage.length} étapes assignées` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Soumettre une étape (porteur)
router.post('/soumettre', auth, upload.single('fichier'), async (req, res) => {
  try {
    const { etapeId, commentaire } = req.body;
    let documentUrl = req.file ? req.file.path : null;
    
    const etape = await Etape.findByIdAndUpdate(
      etapeId,
      { documentUrl, commentairePorteur: commentaire, statut: 'soumise', dateSoumission: new Date() },
      { new: true }
    );
    
    if (!etape) return res.status(404).json({ message: 'Étape non trouvée' });
    
    const admins = await Utilisateur.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        utilisateurId: admin._id,
        titre: '📄 Nouvelle soumission',
        message: `L'étape "${etape.titre}" a été soumise`,
        type: 'info',
        estLue: false,
        lien: '/admin#soumissions'
      });
    }
    
    res.json({ message: 'Étape soumise avec succès', etape });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mes étapes (porteur)
router.get('/mes-etapes', auth, async (req, res) => {
  try {
    const etapes = await Etape.find({ porteurId: req.user.id });
    res.json(etapes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mes soumissions (porteur) - ROUTE AJOUTÉE
router.get('/mes-soumissions', auth, async (req, res) => {
  try {
    const soumissions = await Etape.find({ 
      porteurId: req.user.id,
      statut: { $in: ['soumise', 'validee', 'refusee'] }
    }).sort({ dateSoumission: -1 });
    res.json(soumissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Soumissions en attente (admin)
router.get('/soumissions', auth, isAdmin, async (req, res) => {
  try {
    const soumissions = await Etape.find({ statut: 'soumise' }).populate('porteurId', 'firstName lastName email');
    res.json(soumissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Valider une étape (admin)
router.put('/valider/:id', auth, isAdmin, async (req, res) => {
  try {
    const { commentaire } = req.body;
    const etape = await Etape.findByIdAndUpdate(
      req.params.id,
      { statut: 'validee', commentaireAdmin: commentaire, dateValidation: new Date() },
      { new: true }
    );
    
    await Notification.create({
      utilisateurId: etape.porteurId,
      titre: '✅ Étape validée',
      message: `Votre étape "${etape.titre}" a été validée.`,
      type: 'succes',
      estLue: false,
      lien: '/'
    });
    
    res.json({ message: 'Étape validée', etape });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Refuser une étape (admin)
router.put('/refuser/:id', auth, isAdmin, async (req, res) => {
  try {
    const { commentaire } = req.body;
    const etape = await Etape.findByIdAndUpdate(
      req.params.id,
      { statut: 'refusee', commentaireAdmin: commentaire, dateValidation: new Date() },
      { new: true }
    );
    
    await Notification.create({
      utilisateurId: etape.porteurId,
      titre: '⚠️ Étape à reprendre',
      message: `Votre étape "${etape.titre}" nécessite des modifications. Feedback: ${commentaire}`,
      type: 'erreur',
      estLue: false,
      lien: '/'
    });
    
    res.json({ message: 'Étape refusée', etape });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;