import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'utilisateurs');

async function resetAllPorteurs() {
  await mongoose.connect('mongodb://localhost:27017/incubiny');
  console.log('Connecté');
  
  const nouveauMdp = 'porteur123';
  const hash = await bcrypt.hash(nouveauMdp, 10);

  const result = await User.updateMany(
    { role: 'porteur' },
    { $set: { password: hash } }
  );

  console.log(' Mot de passe réinitialisé pour', result.modifiedCount, 'porteurs');
  console.log('Nouveau mot de passe pour tous:', nouveauMdp);

  process.exit();
}

resetAllPorteurs();