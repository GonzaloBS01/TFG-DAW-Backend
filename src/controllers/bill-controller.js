import { saveBill } from '../services/mongodb/bill-service.js';

export async function createBill(req, res, next) {
    try {
      const savedBill = saveBill(req.body);
      res.status(201).json(savedBill);
    } catch (error) {
      error.status = 400;
      error.message = 'Error al crear la factura';
      next(error);
    }
}
