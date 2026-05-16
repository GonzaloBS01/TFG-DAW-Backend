import {
	createProduct,
	deleteProductController,
	getAllProductsController,
	getProductByIdController,
	updateProductController,
} from '../../../src/controllers/product-controller.js';
import {
	deleteProduct,
	getAllProducts,
	getProductById,
	saveProduct,
	updateProduct,
} from '../../../src/services/mongodb/product-service.js';

jest.mock('../../../src/services/mongodb/product-service.js', () => ({
	__esModule: true,
	saveProduct: jest.fn(),
	getAllProducts: jest.fn(),
	getProductById: jest.fn(),
	updateProduct: jest.fn(),
	deleteProduct: jest.fn(),
}));

describe('product-controller', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = {
			body: {},
			params: {},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			send: jest.fn(),
		};
		next = jest.fn();
		jest.clearAllMocks();
	});

	it('createProduct guarda un producto y responde 201', async () => {
		req.body = { name: 'Camiseta', price: 25 };
		saveProduct.mockResolvedValue({ _id: 'product-1', name: 'Camiseta', price: 25 });

		await createProduct(req, res, next);

		expect(saveProduct).toHaveBeenCalledWith({ name: 'Camiseta', price: 25 });
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ _id: 'product-1', name: 'Camiseta', price: 25 });
	});

	it('getAllProductsController devuelve el listado', async () => {
		getAllProducts.mockResolvedValue([{ _id: 'product-1' }]);

		await getAllProductsController(req, res, next);

		expect(getAllProducts).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([{ _id: 'product-1' }]);
	});

	it('getProductByIdController devuelve 404 si no existe', async () => {
		req.params.id = 'product-404';
		getProductById.mockResolvedValue(null);

		await getProductByIdController(req, res, next);

		expect(getProductById).toHaveBeenCalledWith('product-404');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
	});

	it('updateProductController actualiza y responde 200', async () => {
		req.params.id = 'product-1';
		req.body = { name: 'Camiseta nueva' };
		updateProduct.mockResolvedValue({ _id: 'product-1', name: 'Camiseta nueva' });

		await updateProductController(req, res, next);

		expect(updateProduct).toHaveBeenCalledWith('product-1', { name: 'Camiseta nueva' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ _id: 'product-1', name: 'Camiseta nueva' });
	});

	it('deleteProductController devuelve 204 al borrar', async () => {
		req.params.id = 'product-1';
		deleteProduct.mockResolvedValue({ _id: 'product-1' });

		await deleteProductController(req, res, next);

		expect(deleteProduct).toHaveBeenCalledWith('product-1');
		expect(res.status).toHaveBeenCalledWith(204);
		expect(res.send).toHaveBeenCalledTimes(1);
	});

	it('deleteProductController devuelve 404 si no existe', async () => {
		req.params.id = 'product-404';
		deleteProduct.mockResolvedValue(null);

		await deleteProductController(req, res, next);

		expect(deleteProduct).toHaveBeenCalledWith('product-404');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
	});

	it('createProduct propaga errores al next', async () => {
		const error = new Error('save failed');
		saveProduct.mockRejectedValue(error);

		await createProduct(req, res, next);

		expect(next).toHaveBeenCalledWith(error);
		expect(error.status).toBe(400);
		expect(error.message).toBe('Error al crear el producto');
	});

	it('getAllProductsController propaga errores al next', async () => {
		const error = new Error('find failed');
		getAllProducts.mockRejectedValue(error);

		await getAllProductsController(req, res, next);

		expect(next).toHaveBeenCalledWith(error);
		expect(error.status).toBe(500);
		expect(error.message).toBe('Error al obtener los productos');
	});
});
