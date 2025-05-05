import { saveUser, getAllUsers, getUserById, updateUser, deleteUser } from '../services/mongodb/user-service.js';
export async function createUser(req, res, next) {
  try {
    const savedUser = await saveUser(req.body);
    res.status(201).json(savedUser);
  } catch (error) {
    error.status = 400;
    error.message = 'Error al crear el usuario';
    next(error);
  }
}
export async function getAllUsersController(req, res, next) {
  try {
    const allUsers = await getAllUsers();
    res.status(200).json(allUsers);
  } catch (error) {
    error.status = 500;
    error.message = 'Error al obtener los usuarios';
    next(error);
  }
}
export async function getUserByIdController(req, res, next) {
  try {
    const userByID = await getUserById(req.params.id);
    if (!userByID) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(userByID);
  } catch (error) {
    error.status = 500;
    error.message = 'Error al obtener el usuario';
    next(error);
  }
}
export async function updateUserController(req, res, next) {
  try {
    const user = await updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    error.status = 500;
    error.message = 'Error al actualizar el usuario';
    next(error);
  }
}
export async function deleteUserController(req, res, next) {
  try {
    const user = await deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    error.status = 500;
    error.message = 'Error al eliminar el usuario';
    next(error);
  }
}

