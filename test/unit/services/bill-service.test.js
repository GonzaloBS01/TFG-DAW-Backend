import Bill from '../../../src/models/bill.js';
import {
	deleteBill,
	getAllBills,
	getBillById,
	saveBill,
	updateBill,
} from '../../../src/services/mongodb/bill-service.js';

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockPopulate = jest.fn().mockReturnThis();

jest.mock('../../../src/models/bill.js', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation((bill) => ({
		...bill,
		save: mockSave,
	})),
}));

describe('bill-service', () => {
	beforeEach(() => {
		Bill.find = mockFind;
		Bill.findById = mockFindById;
		Bill.findByIdAndUpdate = mockFindByIdAndUpdate;
		Bill.findByIdAndDelete = mockFindByIdAndDelete;
		jest.clearAllMocks();
	});

	it('saveBill guarda la factura', async () => {
		mockSave.mockResolvedValue(undefined);

		const result = await saveBill({ totalAmount: 100 });

		expect(Bill).toHaveBeenCalledWith({ totalAmount: 100 });
		expect(mockSave).toHaveBeenCalledTimes(1);
		expect(result).toEqual({ totalAmount: 100, save: mockSave });
	});

	it('saveBill lanza error si falla al guardar', async () => {
		mockSave.mockRejectedValue(new Error('DB Error'));

		await expect(saveBill({ totalAmount: 100 })).rejects.toThrow('Error al guardar la factura: DB Error');
	});

	it('getAllBills encadena populate sobre user y products', async () => {
		const query = { populate: mockPopulate };
		mockFind.mockReturnValue(query);

		const result = await getAllBills();

		expect(mockFind).toHaveBeenCalledTimes(1);
		expect(mockPopulate).toHaveBeenCalledWith('user');
		expect(mockPopulate).toHaveBeenCalledWith('products');
		expect(result).toBe(query);
	});

	it('getAllBills lanza error si falla la db', async () => {
		mockFind.mockImplementation(() => { throw new Error('DB Error'); });

		await expect(getAllBills()).rejects.toThrow('Error al obtener las facturas: DB Error');
	});

	it('getBillById devuelve la factura encontrada', async () => {
		const query = { populate: mockPopulate };
		mockFindById.mockReturnValue(query);

		const result = await getBillById('bill-1');

		expect(mockFindById).toHaveBeenCalledWith('bill-1');
		expect(result).toBe(query);
	});

	it('getBillById lanza error si no existe', async () => {
		const query = { populate: mockPopulate };
		mockFindById.mockReturnValue(query);
		mockPopulate.mockReturnValueOnce(query).mockReturnValueOnce(null);

		await expect(getBillById('bill-404')).rejects.toThrow('Error al obtener la factura: Factura no encontrada');
	});

	it('updateBill devuelve la factura actualizada', async () => {
		const query = { populate: mockPopulate };
		mockFindByIdAndUpdate.mockReturnValue(query);

		const result = await updateBill('bill-1', { status: 'paid' });

		expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('bill-1', { status: 'paid' }, { new: true });
		expect(result).toBe(query);
	});

	it('updateBill lanza error si no existe', async () => {
		const query = { populate: mockPopulate };
		mockFindByIdAndUpdate.mockReturnValue(query);
		mockPopulate.mockReturnValueOnce(query).mockReturnValueOnce(null);

		await expect(updateBill('bill-1', { status: 'paid' })).rejects.toThrow('Error al actualizar la factura: Factura no encontrada');
	});

	it('deleteBill devuelve la factura borrada', async () => {
		mockFindByIdAndDelete.mockResolvedValue({ _id: 'bill-1' });

		const result = await deleteBill('bill-1');

		expect(mockFindByIdAndDelete).toHaveBeenCalledWith('bill-1');
		expect(result).toEqual({ _id: 'bill-1' });
	});

	it('deleteBill lanza error si no existe', async () => {
		mockFindByIdAndDelete.mockResolvedValue(null);

		await expect(deleteBill('bill-1')).rejects.toThrow('Error al eliminar la factura: Factura no encontrada');
	});
});
