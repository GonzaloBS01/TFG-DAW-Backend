import express from 'express';
import { subscribe } from '../controllers/newsletter-controller.js';

const router = express.Router();

// No requiere autenticación — cualquier visitante puede suscribirse
router.post('/subscribe', subscribe);

export default router;
