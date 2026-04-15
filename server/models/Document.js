import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  nomFichier: String,
  cheminFichier: String,
  typeFichier: String,
  taille: Number,
  uploadPar: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  etapeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Etape' },
  dateUpload: { type: Date, default: Date.now }
});

export default mongoose.model('Document', documentSchema);