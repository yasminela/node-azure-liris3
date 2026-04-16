import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuration CORS plus flexible pour la production
const allowedOrigins = [
  'http://localhost:3000',
  'https://VOTRE_FRONTEND_VERCEL_URL.vercel.app', // Vous ajouterez l'URL Vercel plus tard
];

app.use(cors({
  origin: function (origin, callback) {
    // Permettre les requêtes sans origine (comme les apps mobiles) ou si l'origine est autorisée
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV === 'production') {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
    },
  credentials: true,
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/telechargements', express.static(path.join(__dirname, 'telechargements')));

// Import routes
import authRoutes from './routes/authentification.js';
import utilisateurRoutes from './routes/utilisateurs.js';
import projetRoutes from './routes/projets.js';
import etapeRoutes from './routes/etapes.js';
import tacheRoutes from './routes/taches.js';
import documentRoutes from './routes/documents.js';
import evenementRoutes from './routes/evenements.js';
import notificationRoutes from './routes/notifications.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/projets', projetRoutes);
app.use('/api/etapes', etapeRoutes);
app.use('/api/taches', tacheRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur fonctionnel' });
});

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});