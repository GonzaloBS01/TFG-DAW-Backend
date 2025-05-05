import express from 'express';
import { createBill, deleteBillController, getAllBillsController, getBillByIdController, updateBillController } from '../controllers/bill-controller.js';

const router = express.Router();

router.post('/', createBill);

router.get('/', getAllBillsController);

router.get('/:id', getBillByIdController);

router.put('/:id', updateBillController);

router.delete('/:id', deleteBillController);

export default router;
