import User from '../../../src/models/user.js';
import {
	deleteUser,
	getAllUsers,
	getUserByEmail,
	getUserById,
	getUsernameByCredentials,
	saveUser,
	updateUser,
	updateUserPassword,
} from '../../../src/services/mongodb/user-service.js';

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockFindOne = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();

jest.mock('../../../src/models/user.js', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation((user) => ({
		...user,
		save: mockSave,
	})),
}));

describe('user-service', () => {
	beforeEach(() => {
		User.find = mockFind;
		User.findById = mockFindById;
		User.findOne = mockFindOne;
		User.findByIdAndUpdate = mockFindByIdAndUpdate;
		User.findByIdAndDelete = mockFindByIdAndDelete;
		jest.clearAllMocks();
	});

	it('saveUser crea y guarda el usuario', async () => {
		mockSave.mockResolvedValue(undefined);

		const result = await saveUser({ username: 'ana' });

		expect(User).toHaveBeenCalledWith({ username: 'ana' });
		expect(mockSave).toHaveBeenCalledTimes(1);
		expect(result).toEqual({ username: 'ana', save: mockSave });
	});

	it('saveUser lanza error si falla al guardar', async () => {
		mockSave.mockRejectedValue(new Error('DB Error'));

		await expect(saveUser({ username: 'ana' })).rejects.toThrow('Error al guardar el usuario: DB Error');
	});

	it('getAllUsers devuelve la lista', async () => {
		mockFind.mockResolvedValue([{ _id: 'user-1' }]);

		const result = await getAllUsers();

		expect(mockFind).toHaveBeenCalledTimes(1);
		expect(result).toEqual([{ _id: 'user-1' }]);
	});

	it('getAllUsers lanza error si falla la db', async () => {
		mockFind.mockRejectedValue(new Error('DB Error'));

		await expect(getAllUsers()).rejects.toThrow('Error al obtener los usuarios: DB Error');
	});

	it('getUserById devuelve el usuario encontrado', async () => {
		mockFindById.mockResolvedValue({ _id: 'user-1' });

		const result = await getUserById('user-1');

		expect(mockFindById).toHaveBeenCalledWith('user-1');
		expect(result).toEqual({ _id: 'user-1' });
	});

	it('getUserById lanza error si no existe', async () => {
		mockFindById.mockResolvedValue(null);

		await expect(getUserById('user-404')).rejects.toThrow('Error al obtener el usuario: Usuario no encontrado');
	});

	it('getUsernameByCredentials devuelve el usuario por username', async () => {
		mockFindOne.mockResolvedValue({ username: 'ana' });

		const result = await getUsernameByCredentials({ username: 'ana' });

		expect(mockFindOne).toHaveBeenCalledWith({ username: 'ana' });
		expect(result).toEqual({ username: 'ana' });
	});

	it('getUsernameByCredentials lanza error si no existe', async () => {
		mockFindOne.mockResolvedValue(null);

		await expect(getUsernameByCredentials({ username: 'ana' })).rejects.toThrow('Error al obtener el usuario: Usuario no encontrado');
	});

	it('getUserByEmail devuelve el usuario', async () => {
		mockFindOne.mockResolvedValue({ email: 'ana@test.com' });

		const result = await getUserByEmail('ana@test.com');

		expect(mockFindOne).toHaveBeenCalledWith({ email: 'ana@test.com' });
		expect(result).toEqual({ email: 'ana@test.com' });
	});

	it('getUserByEmail lanza error si no existe', async () => {
		mockFindOne.mockResolvedValue(null);

		await expect(getUserByEmail('ana@test.com')).rejects.toThrow('Usuario no encontrado');
	});

	it('updateUser devuelve el usuario actualizado', async () => {
		mockFindByIdAndUpdate.mockResolvedValue({ _id: 'user-1', username: 'ana2' });

		const result = await updateUser('user-1', { username: 'ana2' });

		expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('user-1', { username: 'ana2' }, { new: true });
		expect(result).toEqual({ _id: 'user-1', username: 'ana2' });
	});

	it('updateUser lanza error si no existe', async () => {
		mockFindByIdAndUpdate.mockResolvedValue(null);

		await expect(updateUser('user-1', { username: 'ana2' })).rejects.toThrow('Error al actualizar el usuario: Usuario no encontrado');
	});

	it('deleteUser devuelve el usuario borrado', async () => {
		mockFindByIdAndDelete.mockResolvedValue({ _id: 'user-1' });

		const result = await deleteUser('user-1');

		expect(mockFindByIdAndDelete).toHaveBeenCalledWith('user-1');
		expect(result).toEqual({ _id: 'user-1' });
	});

	it('deleteUser lanza error si no existe', async () => {
		mockFindByIdAndDelete.mockResolvedValue(null);

		await expect(deleteUser('user-1')).rejects.toThrow('Error al eliminar el usuario: Usuario no encontrado');
	});

	it('updateUserPassword actualiza solo la contraseña', async () => {
		mockFindByIdAndUpdate.mockResolvedValue({ _id: 'user-1', password: 'hashed' });

		const result = await updateUserPassword('user-1', 'hashed');

		expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('user-1', { password: 'hashed' }, { new: true });
		expect(result).toEqual({ _id: 'user-1', password: 'hashed' });
	});

	it('updateUserPassword lanza error si no existe', async () => {
		mockFindByIdAndUpdate.mockResolvedValue(null);

		await expect(updateUserPassword('user-1', 'hashed')).rejects.toThrow('Error al actualizar la contraseña: Usuario no encontrado');
	});
});
