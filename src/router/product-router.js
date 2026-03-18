import express from 'express';
import { createProduct, deleteProductController, getAllProductsController, updateProductController } from '../controllers/product-controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createProduct);
router.get('/', getAllProductsController);
router.put('/:id', authenticateToken, requireAdmin, updateProductController);
router.delete('/:id', authenticateToken, requireAdmin, deleteProductController);

export default router;
