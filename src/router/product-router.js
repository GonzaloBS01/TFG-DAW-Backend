import express from 'express';
import { createProduct, deleteProductController, getAllProductsController, updateProductController } from '../controllers/product-controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Acceso solo para administradores
 */
router.post('/', authenticateToken, requireAdmin, createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authenticateToken, getAllProductsController);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Acceso solo para administradores
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', authenticateToken, requireAdmin, updateProductController);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Producto eliminado
 *       403:
 *         description: Acceso solo para administradores
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteProductController);

export default router;
