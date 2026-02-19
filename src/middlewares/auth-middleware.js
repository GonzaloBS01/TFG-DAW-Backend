import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

// Middleware para verificar si el usuario está autenticado
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Middleware para verificar si el usuario es admin
export function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Acceso solo para administradores' });
  }
  next();
}

// Middleware para verificar si el usuario es el mismo o admin
export function requireSelfOrAdmin(req, res, next) {
  if (req.user?.isAdmin || req.user?.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado' });
}

