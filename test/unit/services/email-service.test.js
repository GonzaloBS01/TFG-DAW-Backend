import nodemailer from 'nodemailer';
import logger from '../../../src/utils/logger.js';
import {
	initMailer,
	sendCustomRequestNotification,
	sendEmail,
	sendPasswordRecoveryEmail,
	sendPurchaseConfirmationEmail,
	sendPurchaseConfirmationEmailWithPDF,
	sendRegistrationEmail,
} from '../../../src/services/email/email-service.js';

jest.mock('nodemailer', () => ({
	__esModule: true,
	default: {
		createTransport: jest.fn(),
	},
}));

jest.mock('../../../src/utils/logger.js', () => ({
	__esModule: true,
	default: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
	},
}));

describe('email-service', () => {
	let transporter;

	beforeEach(() => {
		transporter = {
			sendMail: jest.fn(),
		};
		nodemailer.createTransport.mockReturnValue(transporter);
		process.env.EMAIL_USER = 'store@test.com';
		process.env.FRONTEND_URL = 'http://frontend.test';
		jest.clearAllMocks();
	});

	it('sendEmail devuelve null si no está configurado', async () => {
		const result = await sendEmail({ to: 'a@test.com' });

		expect(result).toBeNull();
		expect(logger.warn).toHaveBeenCalled();
		expect(transporter.sendMail).not.toHaveBeenCalled();
	});

	it('initMailer crea el transporter', () => {
		const result = initMailer({ email: 'store@test.com', password: 'secret' });

		expect(nodemailer.createTransport).toHaveBeenCalledWith({
			service: 'gmail',
			auth: { user: 'store@test.com', pass: 'secret' },
		});
		expect(result).toBe(transporter);
	});

	it('sendEmail envía el correo si hay transporter', async () => {
		initMailer({ email: 'store@test.com', password: 'secret' });
		transporter.sendMail.mockResolvedValue({ messageId: 'msg-1' });

		const result = await sendEmail({ to: 'a@test.com' });

		expect(transporter.sendMail).toHaveBeenCalledWith({ to: 'a@test.com' });
		expect(result).toEqual({ messageId: 'msg-1' });
	});

	it('sendPasswordRecoveryEmail prepara el correo correcto', async () => {
		initMailer({ email: 'store@test.com', password: 'secret' });
		transporter.sendMail.mockResolvedValue({ messageId: 'msg-1' });

		await sendPasswordRecoveryEmail({ email: 'a@test.com', name: 'Ana' }, 'token-1');

		expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
			to: 'a@test.com',
			subject: 'Recuperación de contraseña',
		}));
	});

	it('sendRegistrationEmail prepara el correo de registro', async () => {
		initMailer({ email: 'store@test.com', password: 'secret' });
		transporter.sendMail.mockResolvedValue({ messageId: 'msg-1' });

		await sendRegistrationEmail({ email: 'a@test.com', name: 'Ana' });

		expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
			subject: 'Bienvenido a nuestra plataforma',
		}));
	});

	it('sendPurchaseConfirmationEmail envía la confirmación de compra', async () => {
		initMailer({ email: 'store@test.com', password: 'secret' });
		transporter.sendMail.mockResolvedValue({ messageId: 'msg-1' });

		await sendPurchaseConfirmationEmail(
			{ email: 'a@test.com', name: 'Ana' },
			{ _id: 'bill-1', totalAmount: 30, createdAt: new Date('2026-01-01') },
		);

		expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
			subject: 'Confirmación de compra',
		}));
	});

	it('sendPurchaseConfirmationEmailWithPDF adjunta el PDF', async () => {
		initMailer({ email: 'store@test.com', password: 'secret' });
		transporter.sendMail.mockResolvedValue({ messageId: 'msg-1' });

		await sendPurchaseConfirmationEmailWithPDF(
			{ email: 'a@test.com', name: 'Ana' },
			{ _id: 'bill-1', totalAmount: 30, createdAt: new Date('2026-01-01') },
			Buffer.from('pdf'),
		);

		expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
			attachments: expect.arrayContaining([
				expect.objectContaining({ filename: 'factura-bill-1.pdf' }),
			]),
		}));
	});

	it('sendCustomRequestNotification prepara la notificación', async () => {
		initMailer({ email: 'store@test.com', password: 'secret' });
		transporter.sendMail.mockResolvedValue({ messageId: 'msg-1' });

		await sendCustomRequestNotification({
			name: 'Ana',
			email: 'a@test.com',
			jewelryType: 'anillo',
			description: 'Quiero un anillo',
		});

		expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
			subject: expect.stringContaining('Nueva solicitud de pieza personalizada'),
		}));
	});
});
