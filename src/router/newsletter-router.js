import express from 'express';
import { subscribe, getAllSubscribersController, unsubscribe, sendNewsletter } from '../controllers/newsletter-controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

// No requiere autenticación — cualquier visitante puede suscribirse
router.post('/subscribe', subscribe);

// Solo admin — obtener todos los suscriptores
router.get('/subscribers', authenticateToken, requireAdmin, getAllSubscribersController);

// Solo admin — dar de baja a un suscriptor
router.delete('/subscribers/:id', authenticateToken, requireAdmin, unsubscribe);

// Solo admin — enviar newsletter a todos los suscriptores
router.post('/send', authenticateToken, requireAdmin, sendNewsletter);

export default router;

