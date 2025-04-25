import express from 'express';
import Bill from '../models/bill.js'; //todo borrar despues de mover a controller
import { createBill } from '../controllers/bill-controller.js';

const router = express.Router();



// Crear una factura
router.post('/', createBill);

// Obtener todas las facturas
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().populate('user').populate('products');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una factura por ID
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('user').populate('products');
    if (!bill) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una factura
router.put('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bill) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(bill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una factura
router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json({ message: 'Factura eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
