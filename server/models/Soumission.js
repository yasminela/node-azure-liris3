import mongoose from 'mongoose';

const soumissionSchema = new mongoose.Schema({
  porteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  etapeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Etape' },
  tacheId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tache' },
  titre: { type: String, required: true },
  dateLimite: { type: Date, required: true },
  dateSoumission: Date,
  statut: { 
    type: String, 
    enum: ['en_attente', 'soumise', 'validee', 'refusee', 'en_retard'], 
    default: 'en_attente' 
  },
  alerteEnvoyee: { type: Boolean, default: false },
  alerteRetardEnvoyee: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Soumission', soumissionSchema);