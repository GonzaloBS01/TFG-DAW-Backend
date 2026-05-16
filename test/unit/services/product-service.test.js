import Product from '../../../src/models/products.js';
import {
	deleteProduct,
	getAllProducts,
	getProductById,
	saveProduct,
	updateProduct,
} from '../../../src/services/mongodb/product-service.js';

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();

jest.mock('../../../src/models/products.js', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation((product) => ({
		...product,
		save: mockSave,
	})),
}));

describe('product-service', () => {
	beforeEach(() => {
		Product.find = mockFind;
		Product.findById = mockFindById;
		Product.findByIdAndUpdate = mockFindByIdAndUpdate;
		Product.findByIdAndDelete = mockFindByIdAndDelete;
		jest.clearAllMocks();
	});

	it('saveProduct crea y guarda el producto', async () => {
		mockSave.mockResolvedValue(undefined);

		const result = await saveProduct({ name: 'Camiseta', price: 25 });

		expect(Product).toHaveBeenCalledWith({ name: 'Camiseta', price: 25 });
		expect(mockSave).toHaveBeenCalledTimes(1);
		expect(result).toEqual({ name: 'Camiseta', price: 25, save: mockSave });
	});

	it('saveProduct lanza error si falla al guardar', async () => {
		mockSave.mockRejectedValue(new Error('DB Error'));

		await expect(saveProduct({ name: 'Camiseta', price: 25 })).rejects.toThrow('Error al guardar el producto: DB Error');
	});

	it('getAllProducts devuelve el listado', async () => {
		mockFind.mockResolvedValue([{ _id: 'product-1' }]);

		const result = await getAllProducts();

		expect(mockFind).toHaveBeenCalledTimes(1);
		expect(result).toEqual([{ _id: 'product-1' }]);
	});

	it('getAllProducts lanza error si falla la db', async () => {
		mockFind.mockRejectedValue(new Error('DB Error'));

		await expect(getAllProducts()).rejects.toThrow('Error al obtener los productos: DB Error');
	});

	it('getProductById devuelve el producto encontrado', async () => {
		mockFindById.mockResolvedValue({ _id: 'product-1' });

		const result = await getProductById('product-1');

		expect(mockFindById).toHaveBeenCalledWith('product-1');
		expect(result).toEqual({ _id: 'product-1' });
	});

	it('getProductById lanza error si no existe', async () => {
		mockFindById.mockResolvedValue(null);

		await expect(getProductById('product-404')).rejects.toThrow('Error al obtener el producto: Producto no encontrado');
	});

	it('updateProduct devuelve el producto actualizado', async () => {
		mockFindByIdAndUpdate.mockResolvedValue({ _id: 'product-1', name: 'Nueva' });

		const result = await updateProduct('product-1', { name: 'Nueva' });

		expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('product-1', { name: 'Nueva' }, { new: true });
		expect(result).toEqual({ _id: 'product-1', name: 'Nueva' });
	});

	it('updateProduct lanza error si no existe', async () => {
		mockFindByIdAndUpdate.mockResolvedValue(null);

		await expect(updateProduct('product-1', { name: 'Nueva' })).rejects.toThrow('Error al actualizar el producto: Producto no encontrado');
	});

	it('deleteProduct devuelve el producto borrado', async () => {
		mockFindByIdAndDelete.mockResolvedValue({ _id: 'product-1' });

		const result = await deleteProduct('product-1');

		expect(mockFindByIdAndDelete).toHaveBeenCalledWith('product-1');
		expect(result).toEqual({ _id: 'product-1' });
	});

	it('deleteProduct lanza error si no existe', async () => {
		mockFindByIdAndDelete.mockResolvedValue(null);

		await expect(deleteProduct('product-1')).rejects.toThrow('Error al eliminar el producto: Producto no encontrado');
	});
});
