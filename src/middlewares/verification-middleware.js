// Middleware para permitir solo al propio usuario o admin
import Bill from '../models/bill.js';

export function requireSelfOrAdmin(req, res, next) {
  if (req.user.isAdmin || req.user.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado' });
}
// Middleware para verificar si el usuario es el propietario de la factura o un admin
export async function requireSelfOrAdminBill(req, res, next) {
  try {
    if (req.user.isAdmin) return next();
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Factura no encontrada' });
    if (bill.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
  } catch (error) {
    next(error);
  }
}
