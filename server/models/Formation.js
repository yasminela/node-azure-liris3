import mongoose from 'mongoose';

const formationSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  duree: { type: String, default: '2 heures' },
  type: { 
    type: String, 
    enum: ['en ligne', 'presentiel', 'hybride'], 
    default: 'en ligne' 
  },
  dateDebut: { type: Date },
  dateFin: { type: Date },
  lieu: { type: String, default: 'En ligne' },
  formateur: { type: String },
  lien: { type: String },
  tags: [{ type: String }],
  prix: { type: Number, default: 0 },
  placesMax: { type: Number, default: 50 },
  placesRestantes: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Formation', formationSchema);