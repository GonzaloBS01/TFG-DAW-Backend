import jwt from 'jsonwebtoken';
import { authenticateToken, requireAdmin, requireSelfOrAdmin } from '../../../src/middlewares/auth-middleware.js';

jest.mock('jsonwebtoken', () => ({
	__esModule: true,
	default: {
		verify: jest.fn(),
	},
}));

describe('auth-middleware', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = {
			headers: {},
			params: {},
			user: undefined,
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
		jest.clearAllMocks();
	});

	describe('authenticateToken', () => {
		it('devuelve 401 si no hay cabecera Authorization', () => {
			authenticateToken(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
			expect(next).not.toHaveBeenCalled();
			expect(jwt.verify).not.toHaveBeenCalled();
		});

		it('devuelve 403 si jwt.verify falla', () => {
			req.headers.authorization = 'Bearer invalid-token';
			jwt.verify.mockImplementation((token, secret, callback) => {
				callback(new Error('invalid token'));
			});

			authenticateToken(req, res, next);

			expect(jwt.verify).toHaveBeenCalledWith('invalid-token', 'default_secret', expect.any(Function));
			expect(res.status).toHaveBeenCalledWith(403);
			expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
			expect(next).not.toHaveBeenCalled();
			expect(req.user).toBeUndefined();
		});

		it('asigna req.user y llama a next() si el token es válido', () => {
			const decodedUser = { id: '123', isAdmin: true };
			req.headers.authorization = 'Bearer valid-token';
			jwt.verify.mockImplementation((token, secret, callback) => {
				callback(null, decodedUser);
			});

			authenticateToken(req, res, next);

			expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'default_secret', expect.any(Function));
			expect(req.user).toEqual(decodedUser);
			expect(next).toHaveBeenCalledTimes(1);
			expect(res.status).not.toHaveBeenCalled();
			expect(res.json).not.toHaveBeenCalled();
		});
	});

	describe('requireAdmin', () => {
		it('deja pasar si req.user.isAdmin === true', () => {
			req.user = { id: '1', isAdmin: true };

			requireAdmin(req, res, next);

			expect(next).toHaveBeenCalledTimes(1);
			expect(res.status).not.toHaveBeenCalled();
			expect(res.json).not.toHaveBeenCalled();
		});

		it('devuelve 403 si no es admin', () => {
			req.user = { id: '1', isAdmin: false };

			requireAdmin(req, res, next);

			expect(res.status).toHaveBeenCalledWith(403);
			expect(res.json).toHaveBeenCalledWith({ message: 'Acceso solo para administradores' });
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe('requireSelfOrAdmin', () => {
		it('deja pasar si req.user.id === req.params.id', () => {
			req.user = { id: '42', isAdmin: false };
			req.params.id = '42';

			requireSelfOrAdmin(req, res, next);

			expect(next).toHaveBeenCalledTimes(1);
			expect(res.status).not.toHaveBeenCalled();
			expect(res.json).not.toHaveBeenCalled();
		});

		it('deja pasar si es admin', () => {
			req.user = { id: '42', isAdmin: true };
			req.params.id = '99';

			requireSelfOrAdmin(req, res, next);

			expect(next).toHaveBeenCalledTimes(1);
			expect(res.status).not.toHaveBeenCalled();
			expect(res.json).not.toHaveBeenCalled();
		});

		it('devuelve 403 en caso contrario', () => {
			req.user = { id: '42', isAdmin: false };
			req.params.id = '99';

			requireSelfOrAdmin(req, res, next);

			expect(res.status).toHaveBeenCalledWith(403);
			expect(res.json).toHaveBeenCalledWith({ message: 'Acceso denegado' });
			expect(next).not.toHaveBeenCalled();
		});
	});
});
