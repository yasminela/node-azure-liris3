import mongoose from 'mongoose';

const projetSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  porteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  statut: { 
    type: String, 
    enum: ['en_attente', 'valide', 'rejete'], 
    default: 'en_attente' 
  },
  feedback: { type: String, default: '' },
  dateDebut: { type: Date, default: Date.now },
  dateValidation: Date,
  dateRejet: Date
});

export default mongoose.model('Projet', projetSchema);