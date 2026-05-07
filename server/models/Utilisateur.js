import mongoose from 'mongoose';

const utilisateurSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'porteur'], default: 'porteur' },
  telephone: { type: String, default: '' },
  faculte: { type: String, default: '' },
  residence: { type: String, default: '' },
  nomProjet: { type: String, default: '' }
}, { collection: 'utilisateurs' });

export default mongoose.model('Utilisateur', utilisateurSchema);