import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  titre: String,
  message: String,
  type: { type: String, default: 'info' },
  estLue: { type: Boolean, default: false },
  lien: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);