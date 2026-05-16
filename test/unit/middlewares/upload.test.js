jest.mock('multer', () => {
	const mockUpload = jest.fn();
	const mockMemoryStorage = jest.fn(() => 'memory-storage');
	const multerMock = jest.fn(options => {
		globalThis.__uploadMocks.capturedOptions = options;
		return mockUpload;
	});
	multerMock.memoryStorage = mockMemoryStorage;
	globalThis.__uploadMocks = { mockUpload, mockMemoryStorage, multerMock, capturedOptions: undefined };
	return multerMock;
});

import { upload } from '../../../src/middlewares/upload.js';

describe('upload middleware', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('configura multer en memoria con límite de 25MB', () => {
		expect(globalThis.__uploadMocks.capturedOptions).toEqual({
			storage: 'memory-storage',
			fileFilter: expect.any(Function),
			limits: { fileSize: 25 * 1024 * 1024 },
		});
		expect(upload).toBe(globalThis.__uploadMocks.mockUpload);
	});

	it('acepta imágenes en fileFilter', () => {
		const cb = jest.fn();

		globalThis.__uploadMocks.capturedOptions.fileFilter({}, { mimetype: 'image/png' }, cb);

		expect(cb).toHaveBeenCalledWith(null, true);
	});

	it('rechaza archivos no imagen', () => {
		const cb = jest.fn();

		globalThis.__uploadMocks.capturedOptions.fileFilter({}, { mimetype: 'application/pdf' }, cb);

		expect(cb).toHaveBeenCalledWith(expect.any(Error), false);
		expect(cb.mock.calls[0][0].message).toBe('Solo se permiten imágenes');
	});
});
