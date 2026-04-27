import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema({
  porteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  projetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Projet', required: false }, // ✅ optionnel
  fichierBMC: { type: String, required: true },
  cheminFichier: { type: String },
  scoreImpact: { type: Number, required: true },
  niveauImpact: { type: String, enum: ['faible', 'moyen', 'fort'], required: true },
  secteur: {
    nom: String,
    couleur: String,
    icone: String
  },
  formations: [{ type: String }],
  feedback: { type: String },
  dateAnalyse: { type: Date, default: Date.now }
});

export default mongoose.model('AIAnalysis', aiAnalysisSchema);