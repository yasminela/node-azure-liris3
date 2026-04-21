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

//  Configuration CORS CORRECTE
app.use(cors({
  origin: [
    'http://localhost:3000',
     'http://localhost:4173',
    'https://final-v-incubiny.vercel.app',
    'https://incubiny.vercel.app',
    'https://incubiny-ez8vcu9xn-yasminelajdel-2575s-projects.vercel.app' 

  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//  Pour les requêtes OPTIONS (préflight)
app.options('*', cors());

app.use(express.json());
app.use('/telechargements', express.static(path.join(__dirname, 'telechargements')));

// Routes
import authRoutes from './routes/authentification.js';
import utilisateurRoutes from './routes/utilisateurs.js';
import projetRoutes from './routes/projets.js';
import etapeRoutes from './routes/etapes.js';
import tacheRoutes from './routes/taches.js';
import documentRoutes from './routes/documents.js';
import evenementRoutes from './routes/evenements.js';
import notificationRoutes from './routes/notifications.js';

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
  .then(() => console.log(' MongoDB connecté'))
  .catch(err => console.error(' Erreur MongoDB:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});