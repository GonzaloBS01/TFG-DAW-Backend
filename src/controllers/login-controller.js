import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, getUsernameByCredentials, saveUser, updateUserPassword } from '../services/mongodb/user-service.js';
import { HttpStatusError } from 'common-errors';
import emailService from '../services/email/email-service.js';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

function isDuplicateUserError(error) {
  return error.message?.includes('E11000') || error.message?.includes('duplicate key');
}

// Registro
export async function signIn(req, res, next) {
  try {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await saveUser({ username, name, email, password: hashedPassword });

    // Enviar correo de bienvenida
    try {
      await emailService.sendRegistrationEmail(user);
    } catch (emailError) {
      console.warn('Email de registro no enviado:', emailError.message);
    }

    res.status(201).json({ message: 'Usuario registrado correctamente.', user });
  } catch (error) {
    if (isDuplicateUserError(error)) {
      return next(new HttpStatusError(409, 'El usuario o email ya existe.'));
    }

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
      { expiresIn: '4h' },
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

    const user = await getUserByEmail(email);

    // Generar token para recuperación
    const recoveryToken = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' },
    );

    // Enviar email con el token
    await emailService.sendPasswordRecoveryEmail(user, recoveryToken);

    res.status(200).json({ message: 'Se ha enviado un correo para recuperar la contraseña.' });
  } catch (error) {
    next(error);
  }
}

// Nueva ruta para restablecer contraseña
export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token y nueva contraseña requeridos.' });
    }

    // Verificar token
    const decodedToken = jwt.verify(token, SECRET_KEY);

    // Hash nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await updateUserPassword(decodedToken.id, hashedPassword);

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
    next(error);
  }
}
