import mongoose from 'mongoose';

const etapeSchema = new mongoose.Schema({
  porteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  projetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Projet' },
  numero: Number,
  titre: { type: String, required: true },
  description: String,
  mois: Number,
  documentRequis: { type: Boolean, default: true },
  documentUrl: String,
  commentairePorteur: String,
  commentaireAdmin: String,
  type: { type: String, enum: ['early-stage', 'externe'], default: 'early-stage' },
  statut: { type: String, enum: ['en_attente', 'soumise', 'validee', 'refusee'], default: 'en_attente' },
  dateSoumission: Date,
  dateValidation: Date
});

export default mongoose.model('Etape', etapeSchema);