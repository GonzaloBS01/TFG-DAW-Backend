import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/user-controller.js';

const router = express.Router();

// Crear un usuario
router.post('/', createUser);

// Obtener todos los usuarios
router.get('/', getAllUsers);

// Obtener un usuario por ID
router.get('/:id', getUserById);

// Actualizar un usuario
router.put('/:id', updateUser);

// Eliminar un usuario
router.delete('/:id', deleteUser);

export default router;
