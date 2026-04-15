import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model('User', userSchema);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/incubiny');
  console.log('Connecté');
  
  // Supprimer tous
  await User.deleteMany({});
  
  // Créer admin avec mot de passe simple
  const hash = await bcrypt.hash('admin123', 10);
  await User.create({
    firstName: 'Admin',
    lastName: 'Incubiny',
    email: 'admin@incubiny.com',
    password: hash,
    role: 'admin'
  });
  
  console.log('Admin créé avec mot de passe: admin123');
  
  const test = await User.findOne({ email: 'admin@incubiny.com' });
  console.log('Password:', test.password);
  
  const verify = await bcrypt.compare('admin123', test.password);
  console.log('Vérification:', verify);
  
  await mongoose.disconnect();
}

main();