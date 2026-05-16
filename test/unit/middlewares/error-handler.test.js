import logger from '../../../src/utils/logger.js';
import { errorMiddleware } from '../../../src/middlewares/error-handler.js';

jest.mock('../../../src/utils/logger.js', () => ({
	__esModule: true,
	default: {
		error: jest.fn(),
	},
}));

describe('error-handler', () => {
	let req;
	let res;

	beforeEach(() => {
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		jest.clearAllMocks();
	});

	it('devuelve 500 y Server Error por defecto', () => {
		const error = new Error('boom');

		errorMiddleware(error, req, res, jest.fn());

		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('boom'));
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.send).toHaveBeenCalledWith({ status: 500, message: 'Server Error' });
	});

	it('respeta el status y el mensaje personalizados', () => {
		const error = { status: 404, message: 'No encontrado', stack: 'stack' };

		errorMiddleware(error, req, res, jest.fn());

		expect(logger.error).toHaveBeenCalledWith('No encontrado stack');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith({ status: 404, message: 'No encontrado' });
	});
});
