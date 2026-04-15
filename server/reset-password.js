import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'utilisateurs');

async function resetPassword() {
  await mongoose.connect('mongodb://localhost:27017/incubiny');
  console.log('Connecté');
  
  const email = 'achraf.meddeb@polytechnicien.tn';
  const nouveauMdp = 'porteur123';

  const hash = await bcrypt.hash(nouveauMdp, 10);
  const result = await User.updateOne(
    { email: email },
    { $set: { password: hash } }
  );

  console.log('Mot de passe réinitialisé pour:', email);
  console.log('Nouveau mot de passe:', nouveauMdp);

  const user = await User.findOne({ email: email });
  const test = await bcrypt.compare(nouveauMdp, user.password);
  console.log('Test connexion:', test ? 'OK' : 'ÉCHEC');

  process.exit();
}

resetPassword();