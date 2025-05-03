import express from 'express';
import { createBill, deleteBill, getAllBills, getBillById, updateBill } from '../controllers/bill-controller.js';

const router = express.Router();

router.post('/', createBill);

router.get('/', getAllBills);

router.get('/:id', getBillById);

router.put('/:id', updateBill);

router.delete('/:id', deleteBill);

export default router;
