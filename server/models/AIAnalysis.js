import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema({
  porteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  projetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Projet' },
  fichierBMC: { type: String, required: true },
  cheminFichier: { type: String, required: true },
  hashContenu: { type: Number, default: 0 },  // Pour détecter les modifications
  scoreImpact: { type: Number, required: true, min: 0, max: 100 },
  niveauImpact: { type: String, enum: ['faible', 'moyen', 'fort'], required: true },
  secteur: {
    icone: { type: String, default: '🚀' },
    nom: { type: String, default: 'Non détecté' }
  },
  formations: [{ type: String }],
  feedback: { type: String },  // Feedback IA
  feedbackAdmin: { type: String, default: null },  // Feedback admin
  dateFeedback: { type: Date },
  dateAnalyse: { type: Date, default: Date.now },
  estModifiee: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('AIAnalysis', aiAnalysisSchema);