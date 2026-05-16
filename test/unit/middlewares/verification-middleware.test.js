import Bill from '../../../src/models/bill.js';
import { requireSelfOrAdminBill } from '../../../src/middlewares/verification-middleware.js';

jest.mock('../../../src/models/bill.js', () => ({
	__esModule: true,
	default: {
		findById: jest.fn(),
	},
}));

describe('verification-middleware', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = {
			params: {},
			user: {},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
		jest.clearAllMocks();
	});

	it('deja pasar si el usuario es admin', async () => {
		req.user = { id: 'admin-1', isAdmin: true };

		await requireSelfOrAdminBill(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(Bill.findById).not.toHaveBeenCalled();
	});

	it('devuelve 404 si la factura no existe', async () => {
		req.user = { id: 'user-1', isAdmin: false };
		req.params.id = 'bill-404';
		Bill.findById.mockResolvedValue(null);

		await requireSelfOrAdminBill(req, res, next);

		expect(Bill.findById).toHaveBeenCalledWith('bill-404');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'Factura no encontrada' });
		expect(next).not.toHaveBeenCalled();
	});

	it('devuelve 403 si la factura no pertenece al usuario', async () => {
		req.user = { id: 'user-1', isAdmin: false };
		req.params.id = 'bill-1';
		Bill.findById.mockResolvedValue({ userId: { toString: () => 'user-2' } });

		await requireSelfOrAdminBill(req, res, next);

		expect(Bill.findById).toHaveBeenCalledWith('bill-1');
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ message: 'Acceso denegado' });
		expect(next).not.toHaveBeenCalled();
	});

	it('llama a next si la factura pertenece al usuario', async () => {
		req.user = { id: 'user-1', isAdmin: false };
		req.params.id = 'bill-1';
		Bill.findById.mockResolvedValue({ userId: { toString: () => 'user-1' } });

		await requireSelfOrAdminBill(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	});

	it('propaga el error con next si Bill.findById falla', async () => {
		req.user = { id: 'user-1', isAdmin: false };
		req.params.id = 'bill-1';
		const error = new Error('db error');
		Bill.findById.mockRejectedValue(error);

		await requireSelfOrAdminBill(req, res, next);

		expect(next).toHaveBeenCalledWith(error);
	});
});
