import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema({
  porteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  projetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Projet' },
  fichierBMC: { type: String, required: true },
  cheminFichier: { type: String, required: true },
  hashContenu: { type: String, default: '' },  // ← CHANGÉ : String au lieu de Number
  scoreImpact: { type: Number, required: true, min: 0, max: 100 },
  niveauImpact: { type: String, enum: ['faible', 'moyen', 'fort'], required: true },
  secteur: {
    icone: { type: String, default: '🚀' },
    nom: { type: String, default: 'Non détecté' }
  },
  recommandations: [{ type: String }],
  formations: [{ type: String }],
  evenements: [{
    titre: String,
    description: String,
    type: String,
    dateDebut: Date,
    dateFin: Date,
    lieu: String,
    formationAssociee: String
  }],
  feedback: { type: String },
  feedbackAdmin: { type: String, default: null },
  dateFeedback: { type: Date },
  dateAnalyse: { type: Date, default: Date.now },
  estModifiee: { type: Boolean, default: false },
  detailsAnalyse: {
    propositionValeur: {
      score: Number,
      niveau: String,
      pointsForts: [String],
      pointsFaibles: [String],
      recommandations: [String]
    },
    marche: {
      score: Number,
      pointsForts: [String],
      pointsFaibles: [String],
      recommandations: [String]
    },
    finance: {
      score: Number,
      pointsForts: [String],
      pointsFaibles: [String],
      recommandations: [String]
    }
  },
  validation: {
    estValide: Boolean,
    scoreConfiance: Number,
    motsTrouves: Number
  }
}, { timestamps: true });

export default mongoose.model('AIAnalysis', aiAnalysisSchema);