import express from 'express';
import { processCheckout } from '../controllers/checkout-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/', authenticateToken, processCheckout);

export default router;
