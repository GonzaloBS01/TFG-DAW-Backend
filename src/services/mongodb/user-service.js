import User from '../../models/user.js';

export async function saveUser(user) {
  try {
    const newUser = new User(user);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(`Error al guardar el usuario: ${error.message}`);
  }
}
export async function getAllUsers() {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error(`Error al obtener los usuarios: ${error.message}`);
  }
}
export async function getUserById(id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }
  catch (error) {
    throw new Error(`Error al obtener el usuario: ${error.message}`);
  }
}
export async function updateUser(id, user) {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    if (!updatedUser) {
      throw new Error('Usuario no encontrado');
    }
    return updatedUser;
  }
  catch (error) {
    throw new Error(`Error al actualizar el usuario: ${error.message}`);
  }
}
export async function deleteUser(id) {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error('Usuario no encontrado');
    }
    return deletedUser;
  }
  catch (error) {
    throw new Error(`Error al eliminar el usuario: ${error.message}`);
  }
}
