import {
	createCustomRequest,
	getAllCustomRequestsController,
	updateStatusController,
} from '../../../src/controllers/custom-request-controller.js';
import {
	saveCustomRequest,
	getAllCustomRequests,
	updateCustomRequestStatus,
} from '../../../src/services/mongodb/custom-request-service.js';
import { sendCustomRequestNotification } from '../../../src/services/email/email-service.js';

jest.mock('../../../src/services/mongodb/custom-request-service.js', () => ({
	__esModule: true,
	saveCustomRequest: jest.fn(),
	getAllCustomRequests: jest.fn(),
	updateCustomRequestStatus: jest.fn(),
}));

jest.mock('../../../src/services/email/email-service.js', () => ({
	__esModule: true,
	sendCustomRequestNotification: jest.fn(),
}));

describe('custom-request-controller', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = { body: {}, params: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
		jest.clearAllMocks();
	});

	it('createCustomRequest guarda la solicitud y responde 201', async () => {
		req.body = { name: 'Ana', email: 'ana@test.com' };
		saveCustomRequest.mockResolvedValue({ _id: 'req-1', name: 'Ana' });
		sendCustomRequestNotification.mockResolvedValue();

		await createCustomRequest(req, res, next);

		expect(saveCustomRequest).toHaveBeenCalledWith({ name: 'Ana', email: 'ana@test.com' });
		expect(sendCustomRequestNotification).toHaveBeenCalledWith({ _id: 'req-1', name: 'Ana' });
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Solicitud enviada correctamente',
			request: { _id: 'req-1', name: 'Ana' },
		});
	});

	it('createCustomRequest no bloquea si falla el email', async () => {
		req.body = { name: 'Ana', email: 'ana@test.com' };
		saveCustomRequest.mockResolvedValue({ _id: 'req-1', name: 'Ana' });
		sendCustomRequestNotification.mockRejectedValue(new Error('smtp error'));
		jest.spyOn(console, 'warn').mockImplementation(() => {});

		await createCustomRequest(req, res, next);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Solicitud enviada correctamente' }));
		expect(next).not.toHaveBeenCalled();
		console.warn.mockRestore();
	});

	it('getAllCustomRequestsController devuelve las solicitudes', async () => {
		getAllCustomRequests.mockResolvedValue([{ _id: 'req-1' }]);

		await getAllCustomRequestsController(req, res, next);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([{ _id: 'req-1' }]);
	});

	it('updateStatusController devuelve 404 si no existe', async () => {
		req.params.id = 'req-404';
		req.body = { status: 'approved' };
		updateCustomRequestStatus.mockResolvedValue(null);

		await updateStatusController(req, res, next);

		expect(updateCustomRequestStatus).toHaveBeenCalledWith('req-404', 'approved');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Solicitud no encontrada' });
	});

	it('updateStatusController devuelve 200 si actualiza', async () => {
		req.params.id = 'req-1';
		req.body = { status: 'approved' };
		updateCustomRequestStatus.mockResolvedValue({ _id: 'req-1', status: 'approved' });

		await updateStatusController(req, res, next);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ _id: 'req-1', status: 'approved' });
	});
});
