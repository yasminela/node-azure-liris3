import mongoose from 'mongoose';

const tacheSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  porteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  type: { type: String, enum: ['externe', 'formulaire'], default: 'externe' },
  lienFormulaire: String,
  documentUrl: String,
  commentairePorteur: String,
  commentaireAdmin: String,
  statut: { type: String, enum: ['en_attente', 'soumise', 'validee', 'refusee'], default: 'en_attente' },
  dateLimite: Date,
  dateSoumission: Date,
  dateValidation: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Tache', tacheSchema);