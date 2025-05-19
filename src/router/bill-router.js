import express from 'express';
import { createBill, deleteBillController, getAllBillsController, getBillByIdController, updateBillController } from '../controllers/bill-controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

/**
 * @swagger
 * /bills:
 *   post:
 *     summary: Crear una nueva factura
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BillInput'
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Acceso solo para administradores
 */
router.post('/', authenticateToken, requireAdmin, createBill);

/**
 * @swagger
 * /bills:
 *   get:
 *     summary: Obtener todas las facturas
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de facturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authenticateToken, getAllBillsController);

/**
 * @swagger
 * /bills/{id}:
 *   get:
 *     summary: Obtener una factura por ID
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Factura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       404:
 *         description: Factura no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', authenticateToken, getBillByIdController);

/**
 * @swagger
 * /bills/{id}:
 *   put:
 *     summary: Actualizar una factura
 *     tags: [Facturas]
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
 *             $ref: '#/components/schemas/BillInput'
 *     responses:
 *       200:
 *         description: Factura actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Acceso solo para administradores
 *       404:
 *         description: Factura no encontrada
 */
router.put('/:id', authenticateToken, requireAdmin, updateBillController);

/**
 * @swagger
 * /bills/{id}:
 *   delete:
 *     summary: Eliminar una factura
 *     tags: [Facturas]
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
 *         description: Factura eliminada
 *       403:
 *         description: Acceso solo para administradores
 *       404:
 *         description: Factura no encontrada
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteBillController);

export default router;
