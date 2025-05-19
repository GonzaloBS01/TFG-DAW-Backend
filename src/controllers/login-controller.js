import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, getUsernameByCredentials, saveUser } from '../services/mongodb/user-service.js';
import { HttpStatusError } from 'common-errors';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

// Registro
export async function signIn(req, res, next) {
  try {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await saveUser({ username, name, email, hashedPassword });
    res.status(201).json({ message: 'Usuario registrado correctamente.', user });
  } catch (error) {
    next(error);
  }
}

// Login
export async function logIn(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos.' });
    }

    const user = await getUsernameByCredentials({ username, password });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error();
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.role === 'admin' },
      SECRET_KEY,
      { expiresIn: '1h' },
    );

    return res.status(200).json({ token, user: { id: user._id, username: user.username, isAdmin: user.role === 'admin' } });
  } catch (error) {
    next(new HttpStatusError(401, 'Credenciales Inválidas'));
  }
}

// Recuperar contraseña
export async function recoverPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email requerido.' });
    }
    const result = await getUserByEmail(email);
    // TODO: Send recovery email
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
