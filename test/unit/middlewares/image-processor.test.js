jest.mock('sharp', () => {
	const mockToBuffer = jest.fn();
	const mockJpeg = jest.fn(() => ({ toBuffer: mockToBuffer }));
	const mockResize = jest.fn(() => ({ jpeg: mockJpeg }));
	const mockSharp = jest.fn(() => ({ resize: mockResize }));
	globalThis.__imageProcessorMocks = { mockSharp, mockResize, mockJpeg, mockToBuffer };
	return {
		__esModule: true,
		default: mockSharp,
	};
});

import { imageProcessor } from '../../../src/middlewares/image-processor.js';

describe('image-processor', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = { files: undefined, body: {} };
		res = {};
		next = jest.fn();
		jest.clearAllMocks();
	});

	it('continúa sin procesar cuando no hay archivos', async () => {
		await imageProcessor(req, res, next);

		expect(next).toHaveBeenCalledWith();
		expect(globalThis.__imageProcessorMocks.mockSharp).not.toHaveBeenCalled();
	});

	it('convierte las imágenes a base64 y las inyecta en req.body', async () => {
		req.files = [{ buffer: Buffer.from('img-1') }, { buffer: Buffer.from('img-2') }];
		globalThis.__imageProcessorMocks.mockToBuffer
			.mockResolvedValueOnce(Buffer.from('jpeg-1'))
			.mockResolvedValueOnce(Buffer.from('jpeg-2'));

		await imageProcessor(req, res, next);

		expect(globalThis.__imageProcessorMocks.mockSharp).toHaveBeenNthCalledWith(1, req.files[0].buffer);
		expect(globalThis.__imageProcessorMocks.mockSharp).toHaveBeenNthCalledWith(2, req.files[1].buffer);
		expect(req.body.images).toEqual([
			'data:image/jpeg;base64,' + Buffer.from('jpeg-1').toString('base64'),
			'data:image/jpeg;base64,' + Buffer.from('jpeg-2').toString('base64'),
		]);
		expect(req.body.image).toBe(req.body.images[0]);
		expect(next).toHaveBeenCalledWith();
	});

	it('añade status y mensaje si sharp falla', async () => {
		req.files = [{ buffer: Buffer.from('img-1') }];
		const error = new Error('fallo sharp');
		globalThis.__imageProcessorMocks.mockToBuffer.mockRejectedValueOnce(error);

		await imageProcessor(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.objectContaining({
			status: 400,
			message: 'Error procesando imágenes: fallo sharp',
		}));
	});
});
