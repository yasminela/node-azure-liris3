import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'utilisateurs');

await mongoose.connect('mongodb://localhost:27017/incubiny');

const users = await User.find({});
console.log('Utilisateurs trouvés:', users.length);

users.forEach(u => {
  console.log('---');
  console.log('Email:', u.email);
  console.log('Role:', u.role);
  console.log('Password existe:', !!u.password);
  console.log('Password hash:', u.password ? u.password.substring(0, 30) + '...' : 'null');
});

if (users.length === 0) {
  console.log('Aucun utilisateur trouvé !');
}

process.exit();