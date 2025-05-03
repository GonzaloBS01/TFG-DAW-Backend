import { Router } from 'express';

import userRouter from '../router/user-router.js';
import productRouter from '../router/product-router.js';
import billRouter from '../router/bill-router.js';
import loginRouter from '../router/login-router.js';

const router = Router();

async function pingHandler(req, res, next) {
  try {
    res.status(200).json({ message: 'Pong' });
  } catch (error) {
    next(error);
  }
}

router.get('/ping', pingHandler);
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/bills', billRouter);
router.use('/auth', loginRouter);

export default router;
