import express from 'express';
import { createProduct, deleteProductController, getAllProductsController, getProductByIdController, updateProductController } from '../controllers/product-controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth-middleware.js';
import { upload } from '../middlewares/upload.js';
import { imageProcessor } from '../middlewares/image-processor.js';

const router = express.Router();

// Acepta hasta 10 imágenes con el campo 'images' (multipart/form-data)
// Si no hay archivos, sigue normal con el body JSON
router.post('/', authenticateToken, requireAdmin, upload.array('images', 10), imageProcessor, createProduct);
router.get('/', getAllProductsController);
router.get('/:id', getProductByIdController);
router.put('/:id', authenticateToken, requireAdmin, upload.array('images', 10), imageProcessor, updateProductController);
router.delete('/:id', authenticateToken, requireAdmin, deleteProductController);

export default router;
