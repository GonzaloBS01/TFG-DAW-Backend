import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

// Crear usuario (registro)
export async function registerUser({ username, name, email, password, role }) {
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new Error('El usuario o email ya existe');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    name,
    email,
    password: hashedPassword,
    role: role || 'user', // Si no se pasa, será 'user'
  });
  await user.save();
  return user;
}

// Login
export async function loginUser({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }
  const token = jwt.sign(
    { id: user._id, username: user.username, isAdmin: user.role === 'admin' },
    SECRET_KEY,
    { expiresIn: '1h' },
  );
  return { token, user: { id: user._id, username: user.username, isAdmin: user.role === 'admin' } };
}

// Recuperar contraseña (simulado, solo verifica existencia)
export async function recoverPassword({ email }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  // Aquí deberías enviar un email real con instrucciones de recuperación
  return { message: 'Instrucciones de recuperación enviadas al email.' };
}
