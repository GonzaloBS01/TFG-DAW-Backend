import express from 'express';
import { createBill, deleteBillController, getAllBillsController, getBillByIdController, updateBillController, downloadBillPDF } from '../controllers/bill-controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createBill);
router.get('/', authenticateToken, getAllBillsController);
router.get('/:id/download', authenticateToken, downloadBillPDF);
router.get('/:id', authenticateToken, getBillByIdController);
router.put('/:id', authenticateToken, requireAdmin, updateBillController);
router.delete('/:id', authenticateToken, requireAdmin, deleteBillController);

export default router;
