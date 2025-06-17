import { Router } from 'express';

import userRouter from '../router/user-router.js';
import productRouter from '../router/product-router.js';
import billRouter from '../router/bill-router.js';
import loginRouter from '../router/login-router.js';
import cartRouter from '../router/cart-router.js';
import checkoutRouter from '../router/checkout-router.js';

const router = Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/bills', billRouter);
router.use('/auth', loginRouter);
router.use('/cart', cartRouter);
router.use('/checkout', checkoutRouter);

export default router;
