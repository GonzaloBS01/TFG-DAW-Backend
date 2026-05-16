import Newsletter from '../../../src/models/newsletter.js';
import {
	getAllSubscribers,
	isAlreadySubscribed,
	subscribeEmail,
	unsubscribeEmail,
} from '../../../src/services/mongodb/newsletter-service.js';

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockFindByIdAndDelete = jest.fn();

jest.mock('../../../src/models/newsletter.js', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation(subscriber => ({
		...subscriber,
		save: mockSave,
	})),
}));

describe('newsletter-service', () => {
	beforeEach(() => {
		Newsletter.find = mockFind;
		Newsletter.findOne = mockFindOne;
		Newsletter.findByIdAndDelete = mockFindByIdAndDelete;
		jest.clearAllMocks();
	});

	it('subscribeEmail guarda un nuevo suscriptor', async () => {
		mockSave.mockResolvedValue(undefined);

		const result = await subscribeEmail('test@test.com');

		expect(Newsletter).toHaveBeenCalledWith({ email: 'test@test.com' });
		expect(mockSave).toHaveBeenCalledTimes(1);
		expect(result).toBeUndefined();
	});

	it('getAllSubscribers devuelve la lista ordenada', async () => {
		const query = { sort: jest.fn().mockResolvedValue([{ email: 'a@test.com' }]) };
		mockFind.mockReturnValue(query);

		const result = await getAllSubscribers();

		expect(mockFind).toHaveBeenCalledTimes(1);
		expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
		expect(result).toEqual([{ email: 'a@test.com' }]);
	});

	it('isAlreadySubscribed devuelve true cuando existe el email', async () => {
		mockFindOne.mockResolvedValue({ email: 'test@test.com' });

		await expect(isAlreadySubscribed('TEST@test.com')).resolves.toBe(true);
		expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@test.com' });
	});

	it('isAlreadySubscribed devuelve false cuando no existe', async () => {
		mockFindOne.mockResolvedValue(null);

		await expect(isAlreadySubscribed('test@test.com')).resolves.toBe(false);
	});

	it('unsubscribeEmail elimina el suscriptor', async () => {
		mockFindByIdAndDelete.mockResolvedValue({ _id: 'sub-1' });

		const result = await unsubscribeEmail('sub-1');

		expect(mockFindByIdAndDelete).toHaveBeenCalledWith('sub-1');
		expect(result).toEqual({ _id: 'sub-1' });
	});
});
