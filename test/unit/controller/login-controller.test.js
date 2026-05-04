import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpStatusError } from 'common-errors';
import { signIn, logIn, resetPassword } from '../../../src/controllers/login-controller.js';
import { getUsernameByCredentials, saveUser, updateUserPassword } from '../../../src/services/mongodb/user-service.js';
import emailService from '../../../src/services/email/email-service.js';

jest.mock('bcrypt', () => ({
	__esModule: true,
	default: {
		hash: jest.fn(),
		compare: jest.fn(),
	},
}));

jest.mock('jsonwebtoken', () => ({
	__esModule: true,
	default: {
		sign: jest.fn(),
		verify: jest.fn(),
	},
}));

jest.mock('../../../src/services/mongodb/user-service.js', () => ({
	__esModule: true,
	getUserByEmail: jest.fn(),
	getUsernameByCredentials: jest.fn(),
	saveUser: jest.fn(),
	updateUserPassword: jest.fn(),
}));

jest.mock('../../../src/services/email/email-service.js', () => ({
	__esModule: true,
	default: {
		sendRegistrationEmail: jest.fn(),
		sendPasswordRecoveryEmail: jest.fn(),
	},
}));

describe('login-controller', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = {
			body: {},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
		jest.clearAllMocks();
	});

	describe('signIn', () => {
		it('devuelve 400 si faltan campos', async () => {
			req.body = {
				username: 'juan',
				email: 'juan@test.com',
				password: '123456',
			};

			await signIn(req, res, next);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: 'Faltan campos obligatorios.' });
			expect(bcrypt.hash).not.toHaveBeenCalled();
			expect(saveUser).not.toHaveBeenCalled();
			expect(emailService.sendRegistrationEmail).not.toHaveBeenCalled();
			expect(next).not.toHaveBeenCalled();
		});

		it('hace hash de la contraseña antes de guardar', async () => {
			req.body = {
				username: 'juan',
				name: 'Juan Pérez',
				email: 'juan@test.com',
				password: '123456',
			};
			bcrypt.hash.mockResolvedValue('hashed-password');
			saveUser.mockResolvedValue({ _id: '1', username: 'juan' });
			emailService.sendRegistrationEmail.mockResolvedValue();

			await signIn(req, res, next);

			expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
			expect(saveUser).toHaveBeenCalledWith({
				username: 'juan',
				name: 'Juan Pérez',
				email: 'juan@test.com',
				password: 'hashed-password',
			});
		});

		it('guarda usuario y devuelve 201', async () => {
			const savedUser = {
				_id: '1',
				username: 'juan',
				name: 'Juan Pérez',
				email: 'juan@test.com',
			};
			req.body = {
				username: 'juan',
				name: 'Juan Pérez',
				email: 'juan@test.com',
				password: '123456',
			};
			bcrypt.hash.mockResolvedValue('hashed-password');
			saveUser.mockResolvedValue(savedUser);
			emailService.sendRegistrationEmail.mockResolvedValue();

			await signIn(req, res, next);

			expect(saveUser).toHaveBeenCalledTimes(1);
			expect(emailService.sendRegistrationEmail).toHaveBeenCalledWith(savedUser);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Usuario registrado correctamente.',
				user: savedUser,
			});
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe('logIn', () => {
		it('devuelve 400 si faltan username o password', async () => {
			req.body = {
				username: 'juan',
			};

			await logIn(req, res, next);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: 'Usuario y contraseña requeridos.' });
			expect(getUsernameByCredentials).not.toHaveBeenCalled();
			expect(next).not.toHaveBeenCalled();
		});

		it('devuelve 200 con token y user si credenciales correctas', async () => {
			req.body = {
				username: 'juan',
				password: '123456',
			};
			getUsernameByCredentials.mockResolvedValue({
				_id: 'user-id-1',
				username: 'juan',
				password: 'hashed-password',
				role: 'admin',
			});
			bcrypt.compare.mockResolvedValue(true);
			jwt.sign.mockReturnValue('jwt-token');

			await logIn(req, res, next);

			expect(getUsernameByCredentials).toHaveBeenCalledWith({ username: 'juan', password: '123456' });
			expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed-password');
			expect(jwt.sign).toHaveBeenCalledWith(
				{ id: 'user-id-1', username: 'juan', isAdmin: true },
				'default_secret',
				{ expiresIn: '4h' },
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				token: 'jwt-token',
				user: { id: 'user-id-1', username: 'juan', isAdmin: true },
			});
			expect(next).not.toHaveBeenCalled();
		});

		it('manda 401 al next si contraseña incorrecta', async () => {
			req.body = {
				username: 'juan',
				password: 'wrong-password',
			};
			getUsernameByCredentials.mockResolvedValue({
				_id: 'user-id-1',
				username: 'juan',
				password: 'hashed-password',
				role: 'user',
			});
			bcrypt.compare.mockResolvedValue(false);

			await logIn(req, res, next);

			expect(next).toHaveBeenCalledTimes(1);
			expect(next).toHaveBeenCalledWith(expect.any(HttpStatusError));
			const error = next.mock.calls[0][0];
			expect(error.status).toBe(401);
			expect(error.statusCode).toBe(401);
			expect(error.message).toBe('Credenciales Inválidas');
			expect(res.status).not.toHaveBeenCalledWith(200);
			expect(res.json).not.toHaveBeenCalled();
		});
	});

	describe('resetPassword', () => {
		it('devuelve 400 si faltan token o newPassword', async () => {
			req.body = {
				token: 'valid-token',
			};

			await resetPassword(req, res, next);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: 'Token y nueva contraseña requeridos.' });
			expect(jwt.verify).not.toHaveBeenCalled();
			expect(updateUserPassword).not.toHaveBeenCalled();
			expect(next).not.toHaveBeenCalled();
		});

		it('actualiza contraseña hasheada si token válido', async () => {
			req.body = {
				token: 'valid-token',
				newPassword: 'new-secret',
			};
			jwt.verify.mockReturnValue({ id: 'user-id-1' });
			bcrypt.hash.mockResolvedValue('hashed-new-password');
			updateUserPassword.mockResolvedValue({ _id: 'user-id-1' });

			await resetPassword(req, res, next);

			expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'default_secret');
			expect(bcrypt.hash).toHaveBeenCalledWith('new-secret', 10);
			expect(updateUserPassword).toHaveBeenCalledWith('user-id-1', 'hashed-new-password');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: 'Contraseña actualizada correctamente.' });
			expect(next).not.toHaveBeenCalled();
		});

		it('devuelve 400 si token inválido o expirado', async () => {
			req.body = {
				token: 'expired-token',
				newPassword: 'new-secret',
			};
			const error = new Error('jwt expired');
			error.name = 'TokenExpiredError';
			jwt.verify.mockImplementation(() => {
				throw error;
			});

			await resetPassword(req, res, next);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado.' });
			expect(bcrypt.hash).not.toHaveBeenCalled();
			expect(updateUserPassword).not.toHaveBeenCalled();
			expect(next).not.toHaveBeenCalled();
		});
	});
});
