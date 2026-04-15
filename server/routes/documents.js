import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { auth, isAdmin } from '../middlewares/authentification.js';
import Document from '../models/Document.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './telechargements';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload document
router.post('/upload', auth, upload.single('fichier'), async (req, res) => {
  try {
    const doc = new Document({
      nomFichier: req.file.originalname,
      cheminFichier: req.file.path,
      typeFichier: req.file.mimetype,
      taille: req.file.size,
      uploadPar: req.user.id,
      etapeId: req.body.etapeId
    });
    await doc.save();
    res.json({ message: 'Document uploadé', document: doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mes documents (porteur)
router.get('/mes-documents', auth, async (req, res) => {
  try {
    const docs = await Document.find({ uploadPar: req.user.id });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tous les documents (admin)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const docs = await Document.find().populate('uploadPar', 'firstName lastName');
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
