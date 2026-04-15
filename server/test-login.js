import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());

const userSchema = new mongoose.Schema({
  email: String, password: String, role: String, firstName: String, lastName: String
});
const User = mongoose.model('User', userSchema);

app.post('/test-login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    console.log('Test login:', email, motDePasse);
    
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: 'User not found' });
    
    console.log('User found, password hash:', user.password);
    
    const valid = await bcrypt.compare(motDePasse, user.password);
    console.log('Password valid:', valid);
    
    res.json({ success: valid, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.json({ error: error.message });
  }
});

mongoose.connect('mongodb://localhost:27017/incubiny').then(() => {
  app.listen(5002, () => console.log('Test server on 5002'));
});