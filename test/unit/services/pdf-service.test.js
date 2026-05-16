jest.mock('pdfkit', () => {
	const handlers = {};
	const mockText = jest.fn(() => mockDoc);
	const mockFont = jest.fn(() => mockDoc);
	const mockFontSize = jest.fn(() => mockDoc);
	const mockMoveTo = jest.fn(() => mockDoc);
	const mockLineTo = jest.fn(() => mockDoc);
	const mockStroke = jest.fn(() => mockDoc);
	const mockMoveDown = jest.fn(() => mockDoc);
	const mockEnd = jest.fn(() => {
		if (handlers.data) {
			handlers.data(Buffer.from('chunk-1'));
			handlers.data(Buffer.from('chunk-2'));
		}
		if (handlers.end) {
			handlers.end();
		}
	});
	const mockDoc = {
		on: jest.fn((event, cb) => {
			handlers[event] = cb;
			return mockDoc;
		}),
		fontSize: mockFontSize,
		font: mockFont,
		text: mockText,
		moveTo: mockMoveTo,
		lineTo: mockLineTo,
		stroke: mockStroke,
		moveDown: mockMoveDown,
		end: mockEnd,
		y: 100,
	};
	const mockPdfkit = jest.fn(() => mockDoc);
	globalThis.__pdfServiceMocks = { mockPdfkit, mockText, mockFont, mockFontSize, mockDoc, handlers };
	return {
		__esModule: true,
		default: mockPdfkit,
	};
});

jest.mock('../../../src/utils/logger.js', () => {
	const mockLoggerError = jest.fn();
	globalThis.__pdfServiceLogger = { mockLoggerError };
	return {
		__esModule: true,
		default: {
			error: mockLoggerError,
		},
	};
});

import { generateBillPDF } from '../../../src/services/pdf/pdf-service.js';

describe('pdf-service', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		Object.keys(globalThis.__pdfServiceMocks.handlers).forEach(key => delete globalThis.__pdfServiceMocks.handlers[key]);
		globalThis.__pdfServiceMocks.mockDoc.y = 100;
	});

	it('genera un PDF en memoria', async () => {
		const bill = {
			_id: 'bill-1',
			createdAt: '2026-05-16T10:00:00.000Z',
			billingAddress: 'Calle 1',
			products: [
				{ quantity: 2, price: 10, product: { name: 'Anillo' } },
			],
			totalAmount: 24,
			paymentMethod: 'card',
			status: 'paid',
		};
		const user = { name: 'Ana', email: 'ana@test.com' };

		const pdfBuffer = await generateBillPDF(bill, user);

		expect(globalThis.__pdfServiceMocks.mockPdfkit).toHaveBeenCalledWith({ size: 'A4', margin: 40 });
		expect(globalThis.__pdfServiceMocks.mockText).toHaveBeenCalledWith('FACTURA', { align: 'center' });
		expect(globalThis.__pdfServiceMocks.mockText).toHaveBeenCalledWith(expect.stringContaining('Dirección: Calle 1'));
		expect(globalThis.__pdfServiceMocks.mockText).toHaveBeenCalledWith(expect.stringContaining('Estado del pedido: Pagado'));
		expect(pdfBuffer).toEqual(Buffer.concat([Buffer.from('chunk-1'), Buffer.from('chunk-2')]));
	});

	it('genera el PDF sin dirección y con estado pendiente', async () => {
		const bill = {
			_id: 'bill-2',
			createdAt: '2026-05-16T10:00:00.000Z',
			products: [
				{ quantity: 1, price: 5, product: { name: '' } },
			],
			totalAmount: 5,
			paymentMethod: undefined,
			status: 'pending',
		};
		const user = { name: 'Luis', email: 'luis@test.com' };

		await generateBillPDF(bill, user);

		expect(globalThis.__pdfServiceMocks.mockText).toHaveBeenCalledWith(expect.stringContaining('Estado del pedido: Pendiente'));
		expect(globalThis.__pdfServiceMocks.mockText).toHaveBeenCalledWith(expect.stringContaining('Método de pago: No especificado'));
	});

	it('lanza error y registra si PDFDocument falla', async () => {
		const error = new Error('constructor roto');
		globalThis.__pdfServiceMocks.mockPdfkit.mockImplementationOnce(() => {
			throw error;
		});

		await expect(generateBillPDF({ _id: 'bill-x', createdAt: new Date(), products: [], totalAmount: 0 }, { name: 'A', email: 'a@test.com' }))
			.rejects.toThrow('constructor roto');
	});
});
