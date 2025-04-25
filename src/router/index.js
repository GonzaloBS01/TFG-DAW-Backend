import { Router } from 'express';

import userRouter from '../router/user-router.js';
import productRouter from '../router/product-router.js';
import billRouter from '../router/bill-router.js';
import loginRouter from '../router/login-router.js';

const router = Router();

router.use('/api/users', userRouter);
router.use('/api/products', productRouter);
router.use('/api/bills', billRouter);
router.use('/api/auth', loginRouter);
router.get('/', (req, res) => res.send('API funcionando correctamente'));
