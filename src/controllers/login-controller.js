import { registerUser, loginUser, recoverPassword as recoverPasswordService } from '../services/login/login-service.js';

// Registro
export async function signIn(req, res, next) {
  try {
    const { username, name, email, password, role } = req.body;
    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
    const user = await registerUser({ username, name, email, password, role });
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
    const result = await loginUser({ username, password });
    res.status(200).json({ message: 'Login exitoso.', ...result });
  } catch (error) {
    next(error);
  }
}

// Recuperar contraseña
export async function recoverPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email requerido.' });
    }
    const result = await recoverPasswordService({ email });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
