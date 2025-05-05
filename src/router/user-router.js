import express from 'express';
import {
  createUser,
  getAllUsersController,
  deleteUserController,
  getUserByIdController,
  updateUserController,
} from '../controllers/user-controller.js';

const router = express.Router();

// Crear un usuario
router.post('/', createUser);

// Obtener todos los usuarios
router.get('/', getAllUsersController);

// Obtener un usuario por ID
router.get('/:id', getUserByIdController);

// Actualizar un usuario
router.put('/:id', updateUserController);

// Eliminar un usuario
router.delete('/:id', deleteUserController);

export default router;
