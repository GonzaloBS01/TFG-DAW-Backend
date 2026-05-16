import bcrypt from 'bcrypt';
import {
	createUser,
	deleteUserController,
	getAllUsersController,
	getUserByIdController,
	updateUserController,
} from '../../../src/controllers/user-controller.js';
import {
	deleteUser,
	getAllUsers,
	getUserById,
	saveUser,
	updateUser,
} from '../../../src/services/mongodb/user-service.js';

jest.mock('bcrypt', () => ({
	__esModule: true,
	default: {
		hash: jest.fn(),
	},
}));

jest.mock('../../../src/services/mongodb/user-service.js', () => ({
	__esModule: true,
	saveUser: jest.fn(),
	getAllUsers: jest.fn(),
	getUserById: jest.fn(),
	updateUser: jest.fn(),
	deleteUser: jest.fn(),
}));

describe('user-controller', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = {
			body: {},
			params: {},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			send: jest.fn(),
		};
		next = jest.fn();
		jest.clearAllMocks();
	});

	it('createUser hashea la contraseña y guarda el usuario', async () => {
		req.body = { username: 'ana', password: 'secret' };
		bcrypt.hash.mockResolvedValue('hashed-secret');
		saveUser.mockResolvedValue({ _id: 'user-1', username: 'ana' });

		await createUser(req, res, next);

		expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
		expect(saveUser).toHaveBeenCalledWith({ username: 'ana', password: 'hashed-secret' });
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ _id: 'user-1', username: 'ana' });
		expect(next).not.toHaveBeenCalled();
	});

	it('getAllUsersController devuelve la lista de usuarios', async () => {
		getAllUsers.mockResolvedValue([{ _id: 'user-1' }]);

		await getAllUsersController(req, res, next);

		expect(getAllUsers).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([{ _id: 'user-1' }]);
		expect(next).not.toHaveBeenCalled();
	});

	it('getUserByIdController devuelve 404 si el usuario no existe', async () => {
		req.params.id = 'user-404';
		getUserById.mockResolvedValue(null);

		await getUserByIdController(req, res, next);

		expect(getUserById).toHaveBeenCalledWith('user-404');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
		expect(next).not.toHaveBeenCalled();
	});

	it('updateUserController actualiza y hashea la contraseña', async () => {
		req.params.id = 'user-1';
		req.body = { username: 'ana', password: 'new-secret' };
		bcrypt.hash.mockResolvedValue('hashed-new-secret');
		updateUser.mockResolvedValue({ _id: 'user-1', username: 'ana' });

		await updateUserController(req, res, next);

		expect(bcrypt.hash).toHaveBeenCalledWith('new-secret', 10);
		expect(updateUser).toHaveBeenCalledWith('user-1', {
			username: 'ana',
			password: 'hashed-new-secret',
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ _id: 'user-1', username: 'ana' });
	});

	it('updateUserController devuelve 404 si no encuentra usuario', async () => {
		req.params.id = 'user-404';
		req.body = { username: 'ana' };
		updateUser.mockResolvedValue(null);

		await updateUserController(req, res, next);

		expect(updateUser).toHaveBeenCalledWith('user-404', { username: 'ana' });
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
		expect(next).not.toHaveBeenCalled();
	});

	it('deleteUserController devuelve 204 al eliminar', async () => {
		req.params.id = 'user-1';
		deleteUser.mockResolvedValue({ _id: 'user-1' });

		await deleteUserController(req, res, next);

		expect(deleteUser).toHaveBeenCalledWith('user-1');
		expect(res.status).toHaveBeenCalledWith(204);
		expect(res.send).toHaveBeenCalledTimes(1);
	});

	it('deleteUserController devuelve 404 si no existe', async () => {
		req.params.id = 'user-404';
		deleteUser.mockResolvedValue(null);

		await deleteUserController(req, res, next);

		expect(deleteUser).toHaveBeenCalledWith('user-404');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
		expect(next).not.toHaveBeenCalled();
	});

	it('createUser propaga errores al next', async () => {
		const error = new Error('hash failed');
		bcrypt.hash.mockRejectedValueOnce(error);
		req.body = { username: 'ana', password: 'secret' };

		await createUser(req, res, next);

		expect(next).toHaveBeenCalledWith(error);
		expect(error.status).toBe(400);
		expect(error.message).toBe('Error al crear el usuario');
	});

	it('updateUserController propaga errores al next', async () => {
		const error = new Error('update failed');
		updateUser.mockRejectedValue(error);
		req.params.id = 'user-1';
		req.body = { username: 'ana' };

		await updateUserController(req, res, next);

		expect(next).toHaveBeenCalledWith(error);
		expect(error.status).toBe(500);
		expect(error.message).toBe('Error al actualizar el usuario');
	});
});
