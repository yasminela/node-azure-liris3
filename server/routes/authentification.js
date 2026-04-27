import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Utilisateur from '../models/Utilisateur.js';

const router = express.Router();

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    
    console.log('📩 Tentative de connexion:', email);
    
    // Vérifier si l'utilisateur existe
    const user = await Utilisateur.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const valid = await bcrypt.compare(motDePasse, user.password);
    if (!valid) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Générer le token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );
    
    console.log('✅ Connexion réussie:', email);
    
    // Retourner les informations utilisateur (sans le mot de passe)
    res.json({
      success: true,
      token,
      utilisateur: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        telephone: user.telephone || '',
        faculte: user.faculte || '',
        residence: user.residence || '',
        nomProjet: user.nomProjet || ''
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
});

// Route pour vérifier le token (optionnelle)
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ valid: false, message: 'Aucun token fourni' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const user = await Utilisateur.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ valid: false, message: 'Utilisateur non trouvé' });
    }
    
    res.json({ valid: true, user });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Token invalide' });
  }
});

export default router;