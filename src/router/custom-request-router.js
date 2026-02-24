import express from 'express';
import { createCustomRequest, getAllCustomRequestsController, updateStatusController } from '../controllers/custom-request-controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Cualquier usuario autenticado puede enviar una solicitud
router.post('/', authenticateToken, createCustomRequest);

// Solo admin puede ver todas las solicitudes
router.get('/', authenticateToken, requireAdmin, getAllCustomRequestsController);

// Solo admin puede actualizar el estado
router.put('/:id/status', authenticateToken, requireAdmin, updateStatusController);

export default router;
