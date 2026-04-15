import mongoose from 'mongoose';

const evenementSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  type: { type: String, default: 'formation' },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  lieu: String,
  lien: String,
  formateur: String,
  estPublic: { type: Boolean, default: true },
  porteursAssignes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Evenement', evenementSchema);