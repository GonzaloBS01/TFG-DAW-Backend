import express from 'express';
import {
  createUser,
  getAllUsersController,
  deleteUserController,
  updateUserController,
} from '../controllers/user-controller.js';
import { authenticateToken, requireAdmin, requireSelfOrAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createUser);
router.get('/', authenticateToken, requireAdmin, getAllUsersController);
router.put('/:id', authenticateToken, requireSelfOrAdmin, updateUserController);
router.delete('/:id', authenticateToken, requireAdmin, deleteUserController);

export default router;
