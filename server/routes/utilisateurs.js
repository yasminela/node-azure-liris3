import express from 'express';
import { auth, isAdmin } from '../middlewares/authentification.js';
import bcrypt from 'bcryptjs';
import Utilisateur from '../models/Utilisateur.js';

const router = express.Router();

// Tous les utilisateurs (admin)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await Utilisateur.find().select('-password');
    res.json(users);
  } catch (error) {
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
      firstName,
      lastName,
      email,
      password: hash,
      role: 'porteur',
      telephone,
      faculte,
      residence,
      nomProjet
    });
    
    await user.save();
    res.status(201).json({ message: 'Porteur créé', user: { id: user._id, firstName, lastName, email, role: 'porteur' } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modifier un porteur (admin)
// Modifier un porteur (admin)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, telephone, faculte, residence, nomProjet } = req.body;
    
    const user = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, telephone, faculte, residence, nomProjet },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({ message: 'Porteur modifié', user });
  } catch (error) {
    console.error('Erreur modification:', error);
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un utilisateur
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Utilisateur.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;