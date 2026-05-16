import {
	createBill,
	deleteBillController,
	downloadBillPDF,
	getAllBillsController,
	getBillByIdController,
	updateBillController,
} from '../../../src/controllers/bill-controller.js';
import {
	deleteBill,
	getAllBills,
	getBillById,
	saveBill,
	updateBill,
} from '../../../src/services/mongodb/bill-service.js';
import { generateBillPDF } from '../../../src/services/pdf/pdf-service.js';

jest.mock('../../../src/services/mongodb/bill-service.js', () => ({
	__esModule: true,
	saveBill: jest.fn(),
	getAllBills: jest.fn(),
	getBillById: jest.fn(),
	updateBill: jest.fn(),
	deleteBill: jest.fn(),
}));

jest.mock('../../../src/services/pdf/pdf-service.js', () => ({
	__esModule: true,
	generateBillPDF: jest.fn(),
}));

describe('bill-controller', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = {
			body: {},
			params: {},
			user: { id: 'user-1', role: 'user' },
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			send: jest.fn(),
			setHeader: jest.fn(),
		};
		next = jest.fn();
		jest.clearAllMocks();
	});

	it('createBill guarda y devuelve la factura creada', async () => {
		req.body = { totalAmount: 120 };
		saveBill.mockResolvedValue({ _id: 'bill-1', totalAmount: 120 });

		await createBill(req, res, next);

		expect(saveBill).toHaveBeenCalledWith({ totalAmount: 120 });
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ _id: 'bill-1', totalAmount: 120 });
	});

	it('getAllBillsController devuelve todas las facturas', async () => {
		getAllBills.mockResolvedValue([{ _id: 'bill-1' }]);

		await getAllBillsController(req, res, next);

		expect(getAllBills).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([{ _id: 'bill-1' }]);
	});

	it('getBillByIdController devuelve 404 si no existe', async () => {
		req.params.id = 'bill-404';
		getBillById.mockResolvedValue(null);

		await getBillByIdController(req, res, next);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Factura no encontrada' });
	});

	it('updateBillController devuelve 404 si no existe', async () => {
		req.params.id = 'bill-404';
		updateBill.mockResolvedValue(null);

		await updateBillController(req, res, next);

		expect(updateBill).toHaveBeenCalledWith('bill-404', {});
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Factura no encontrada' });
	});

	it('deleteBillController devuelve 204 al eliminar', async () => {
		req.params.id = 'bill-1';
		deleteBill.mockResolvedValue({ _id: 'bill-1' });

		await deleteBillController(req, res, next);

		expect(deleteBill).toHaveBeenCalledWith('bill-1');
		expect(res.status).toHaveBeenCalledWith(204);
		expect(res.send).toHaveBeenCalledTimes(1);
	});

	it('downloadBillPDF devuelve 403 si no es propietario ni admin', async () => {
		req.params.id = 'bill-1';
		getBillById.mockResolvedValue({ _id: 'bill-1', user: { _id: { toString: () => 'user-2' } } });

		await downloadBillPDF(req, res, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ error: 'No tienes permisos para descargar esta factura' });
		expect(generateBillPDF).not.toHaveBeenCalled();
	});

	it('downloadBillPDF devuelve 200 y envía el PDF si es propietario', async () => {
		req.params.id = 'bill-1';
		getBillById.mockResolvedValue({
			_id: 'bill-1',
			user: { _id: { toString: () => 'user-1' } },
		});
		generateBillPDF.mockResolvedValue(Buffer.from('pdf'));

		await downloadBillPDF(req, res, next);

		expect(generateBillPDF).toHaveBeenCalledWith(expect.objectContaining({ _id: 'bill-1' }), { _id: { toString: expect.any(Function) } });
		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
		expect(res.send).toHaveBeenCalledWith(expect.any(Buffer));
	});

	it('downloadBillPDF devuelve 500 si el PDF sale vacío', async () => {
		req.params.id = 'bill-1';
		getBillById.mockResolvedValue({
			_id: 'bill-1',
			user: { _id: { toString: () => 'user-1' } },
		});
		generateBillPDF.mockResolvedValue(Buffer.alloc(0));

		await downloadBillPDF(req, res, next);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: 'Error al generar el PDF de la factura' });
	});

	it('downloadBillPDF devuelve 404 si la factura no existe', async () => {
		req.params.id = 'bill-404';
		getBillById.mockResolvedValue(null);

		await downloadBillPDF(req, res, next);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Factura no encontrada' });
		expect(generateBillPDF).not.toHaveBeenCalled();
	});

	it('downloadBillPDF permite descargar a un admin', async () => {
		req.user.role = 'admin';
		req.params.id = 'bill-1';
		getBillById.mockResolvedValue({
			_id: 'bill-1',
			user: { _id: { toString: () => 'user-2' } },
		});
		generateBillPDF.mockResolvedValue(Buffer.from('pdf'));

		await downloadBillPDF(req, res, next);

		expect(res.send).toHaveBeenCalledWith(expect.any(Buffer));
		expect(res.status).not.toHaveBeenCalledWith(403);
	});

	it('downloadBillPDF propaga errores con next', async () => {
		req.params.id = 'bill-1';
		const error = new Error('boom');
		getBillById.mockRejectedValue(error);

		await downloadBillPDF(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
		const forwarded = next.mock.calls[0][0];
		expect(forwarded).toBeInstanceOf(Error);
		expect(forwarded.message).toBe('Error al descargar la factura PDF');
	});
});
