import express from 'express';
import { createProduct, deleteProductController, getAllProductsController, updateProductController } from '../controllers/product-controller.js';
const router = express.Router();

// Crear un producto
router.post('/', createProduct);

// Obtener todos los productos
router.get('/', getAllProductsController);

// Actualizar un producto
router.put('/:id', updateProductController);

// Eliminar un producto
router.delete('/:id', deleteProductController);

export default router;
