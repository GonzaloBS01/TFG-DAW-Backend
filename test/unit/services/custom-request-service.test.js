import CustomRequest from '../../../src/models/custom-request.js';
import {
	getAllCustomRequests,
	saveCustomRequest,
	updateCustomRequestStatus,
} from '../../../src/services/mongodb/custom-request-service.js';

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockSort = jest.fn();
const mockFindByIdAndUpdate = jest.fn();

jest.mock('../../../src/models/custom-request.js', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation((data) => ({
		...data,
		save: mockSave,
	})),
}));

describe('custom-request-service', () => {
	beforeEach(() => {
		CustomRequest.find = mockFind;
		CustomRequest.findByIdAndUpdate = mockFindByIdAndUpdate;
		jest.clearAllMocks();
	});

	it('saveCustomRequest guarda la solicitud', async () => {
		mockSave.mockResolvedValue({ _id: 'req-1' });

		const result = await saveCustomRequest({ name: 'Ana' });

		expect(CustomRequest).toHaveBeenCalledWith({ name: 'Ana' });
		expect(mockSave).toHaveBeenCalledTimes(1);
		expect(result).toEqual({ _id: 'req-1' });
	});

	it('getAllCustomRequests encadena sort por createdAt descendente', async () => {
		mockFind.mockReturnValue({ sort: mockSort });
		mockSort.mockResolvedValue([{ _id: 'req-1' }]);

		const result = await getAllCustomRequests();

		expect(mockFind).toHaveBeenCalledTimes(1);
		expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
		expect(result).toEqual([{ _id: 'req-1' }]);
	});

	it('updateCustomRequestStatus actualiza el estado', async () => {
		mockFindByIdAndUpdate.mockResolvedValue({ _id: 'req-1', status: 'approved' });

		const result = await updateCustomRequestStatus('req-1', 'approved');

		expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('req-1', { status: 'approved' }, { new: true });
		expect(result).toEqual({ _id: 'req-1', status: 'approved' });
	});
});
