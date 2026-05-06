import express from 'express';
import { auth, isAdmin } from '../middlewares/authentification.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Utilisateur from '../models/Utilisateur.js';

const router = express.Router();

// Configuration multer pour les avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './telechargements/avatars';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + req.user.id + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// Récupérer tous les utilisateurs (admin)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await Utilisateur.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer son propre profil
router.get('/me', auth, async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour son propre profil
router.put('/me', auth, async (req, res) => {
  try {
    const { firstName, lastName, email, telephone, faculte, residence } = req.body;
    const user = await Utilisateur.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, telephone, faculte, residence },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPLOAD AVATAR
router.put('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier uploadé' });
    }
    
    const oldUser = await Utilisateur.findById(req.user.id);
    if (oldUser && oldUser.avatar) {
      const oldPath = path.join('.', oldUser.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    
    const avatarUrl = `/telechargements/avatars/${req.file.filename}`;
    
    const user = await Utilisateur.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');
    
    res.json({ message: 'Avatar mis à jour', avatar: avatarUrl, user });
  } catch (error) {
    console.error('Erreur upload avatar:', error);
    res.status(500).json({ message: error.message });
  }
});

// SUPPRIMER AVATAR
router.delete('/avatar', auth, async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.user.id);
    if (user && user.avatar) {
      const oldPath = path.join('.', user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    
    await Utilisateur.findByIdAndUpdate(req.user.id, { avatar: null });
    res.json({ message: 'Avatar supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression avatar:', error);
    res.status(500).json({ message: error.message });
  }
});

// Créer un porteur (admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, password, telephone, faculte, residence, nomProjet } = req.body;
    
    const exists = await Utilisateur.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const user = new Utilisateur({
      firstName, lastName, email, password: hash, role: 'porteur',
      telephone, faculte, residence, nomProjet
    });
    
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ message: 'Porteur créé', user: userResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modifier un porteur (admin)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, telephone, faculte, residence, nomProjet } = req.body;
    const user = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, telephone, faculte, residence, nomProjet },
      { new: true }
    ).select('-password');
    res.json({ message: 'Porteur modifié', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/utilisateurs/:id - Récupérer un utilisateur par ID
router.get('/:id', auth, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id).select('-password');
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier les droits (admin ou soi-même)
    const isAdminUser = req.user.role === 'admin';
    const isSelf = req.user.id === req.params.id;
    
    if (!isAdminUser && !isSelf) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(utilisateur);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un utilisateur (admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Utilisateur.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;