import {
	getAllSubscribers,
	isAlreadySubscribed,
	subscribeEmail,
	unsubscribeEmail,
} from '../../../src/services/mongodb/newsletter-service.js';
import { sendEmail } from '../../../src/services/email/email-service.js';
import {
	getAllSubscribersController,
	sendNewsletter,
	subscribe,
	unsubscribe,
} from '../../../src/controllers/newsletter-controller.js';

jest.mock('../../../src/services/mongodb/newsletter-service.js', () => ({
	__esModule: true,
	subscribeEmail: jest.fn(),
	isAlreadySubscribed: jest.fn(),
	getAllSubscribers: jest.fn(),
	unsubscribeEmail: jest.fn(),
}));

jest.mock('../../../src/services/email/email-service.js', () => ({
	__esModule: true,
	default: {
		sendEmail: jest.fn(),
	},
	sendEmail: jest.fn(),
}));

describe('newsletter-controller', () => {
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

	it('subscribe devuelve 400 si falta email', async () => {
		await subscribe(req, res, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: 'El email es obligatorio' });
	});

	it('subscribe devuelve 400 si el formato es inválido', async () => {
		req.body.email = 'correo-invalido';

		await subscribe(req, res, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: 'Formato de email inválido' });
		expect(isAlreadySubscribed).not.toHaveBeenCalled();
	});

	it('subscribe devuelve 200 si ya estaba suscrito', async () => {
		req.body.email = 'ana@test.com';
		isAlreadySubscribed.mockResolvedValue(true);

		await subscribe(req, res, next);

		expect(isAlreadySubscribed).toHaveBeenCalledWith('ana@test.com');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: '¡Ya estás suscrito a nuestra newsletter!' });
		expect(subscribeEmail).not.toHaveBeenCalled();
	});

	it('subscribe crea la suscripción cuando no existe', async () => {
		req.body.email = 'ana@test.com';
		isAlreadySubscribed.mockResolvedValue(false);
		subscribeEmail.mockResolvedValue(undefined);

		await subscribe(req, res, next);

		expect(subscribeEmail).toHaveBeenCalledWith('ana@test.com');
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ message: '¡Te has suscrito correctamente a la newsletter!' });
	});

	it('getAllSubscribersController devuelve la lista', async () => {
		getAllSubscribers.mockResolvedValue([{ email: 'a@test.com' }]);

		await getAllSubscribersController(req, res, next);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([{ email: 'a@test.com' }]);
	});

	it('unsubscribe devuelve 404 si no existe', async () => {
		req.params.id = 'subscriber-404';
		unsubscribeEmail.mockResolvedValue(null);

		await unsubscribe(req, res, next);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'Suscriptor no encontrado' });
	});

	it('unsubscribe confirma la baja', async () => {
		req.params.id = 'subscriber-1';
		unsubscribeEmail.mockResolvedValue({ _id: 'subscriber-1' });

		await unsubscribe(req, res, next);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: 'Usuario dado de baja correctamente' });
	});

	it('sendNewsletter devuelve 400 si faltan datos', async () => {
		await sendNewsletter(req, res, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: 'El asunto y el mensaje son obligatorios' });
	});

	it('sendNewsletter devuelve 400 si no hay suscriptores', async () => {
		req.body = { subject: 'Hola', message: 'Mensaje' };
		getAllSubscribers.mockResolvedValue([]);

		await sendNewsletter(req, res, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: 'No hay suscriptores a los que enviar' });
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it('sendNewsletter envía el correo a todos los suscriptores', async () => {
		req.body = { subject: 'Hola', message: 'Linea 1\nLinea 2' };
		getAllSubscribers.mockResolvedValue([
			{ email: 'a@test.com' },
			{ email: 'b@test.com' },
		]);
		sendEmail.mockResolvedValue(undefined);

		await sendNewsletter(req, res, next);

		expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
			bcc: ['a@test.com', 'b@test.com'],
			subject: 'Hola',
			html: expect.any(String),
		}));
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Newsletter enviada correctamente a 2 suscriptores',
			totalSent: 2,
		});
	});
});
