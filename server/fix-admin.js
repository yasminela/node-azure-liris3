import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'utilisateurs');

async function fixAdmin() {
  await mongoose.connect('mongodb://localhost:27017/incubiny');
  console.log('Connecté');
  
  const hash = await bcrypt.hash('admin123', 10);
  const result = await User.updateOne(
    { email: 'admin@incubiny.com' },
    { $set: { password: hash } }
  );

  console.log(' Admin mis à jour:', result.modifiedCount > 0 ? 'Succès' : 'Échec');

  const admin = await User.findOne({ email: 'admin@incubiny.com' });
  console.log('Password existe maintenant:', !!admin.password);

  const test = await bcrypt.compare('admin123', admin.password);
  console.log('Test connexion:', test ? ' OK' : ' ÉCHEC');

  process.exit();
}

fixAdmin();