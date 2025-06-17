import express from 'express';
import {
  getCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCartController,
} from '../controllers/cart-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.post('/items', authenticateToken, addItem);
router.put('/items/:productId', authenticateToken, updateQuantity);
router.delete('/items/:productId', authenticateToken, removeItem);
router.delete('/', authenticateToken, clearCartController);

export default router;
