import express from 'express';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/product-controller.js';
const router = express.Router();

// Crear un producto
router.post('/', createProduct);

// Obtener todos los productos
router.get('/', getAllProducts);

// Actualizar un producto
router.put('/:id', updateProduct);

// Eliminar un producto
router.delete('/:id', deleteProduct);

export default router;
