import {
	addItem,
	clearCartController,
	getCart,
	removeItem,
	updateQuantity,
} from '../../../src/controllers/cart-controller.js';
import {
	addItemToCart,
	clearCart,
	getCartByUserId,
	removeItemFromCart,
	updateItemQuantity,
} from '../../../src/services/mongodb/cart-service.js';

jest.mock('../../../src/services/mongodb/cart-service.js', () => ({
	__esModule: true,
	getCartByUserId: jest.fn(),
	addItemToCart: jest.fn(),
	removeItemFromCart: jest.fn(),
	updateItemQuantity: jest.fn(),
	clearCart: jest.fn(),
}));

describe('cart-controller', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = {
			body: {},
			params: {},
			user: { id: 'user-1' },
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
		jest.clearAllMocks();
	});

	it('getCart devuelve el carrito del usuario', async () => {
		getCartByUserId.mockResolvedValue({ items: [] });

		await getCart(req, res, next);

		expect(getCartByUserId).toHaveBeenCalledWith('user-1');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ items: [] });
	});

	it('addItem añade un producto al carrito', async () => {
		req.body = { productId: 'product-1', quantity: 2 };
		addItemToCart.mockResolvedValue({ items: [{ product: 'product-1', quantity: 2 }] });

		await addItem(req, res, next);

		expect(addItemToCart).toHaveBeenCalledWith('user-1', 'product-1', 2);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ items: [{ product: 'product-1', quantity: 2 }] });
	});

	it('removeItem elimina un producto del carrito', async () => {
		req.params.productId = 'product-1';
		removeItemFromCart.mockResolvedValue({ items: [] });

		await removeItem(req, res, next);

		expect(removeItemFromCart).toHaveBeenCalledWith('user-1', 'product-1');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ items: [] });
	});

	it('updateQuantity actualiza la cantidad del producto', async () => {
		req.params.productId = 'product-1';
		req.body.quantity = 5;
		updateItemQuantity.mockResolvedValue({ items: [{ product: 'product-1', quantity: 5 }] });

		await updateQuantity(req, res, next);

		expect(updateItemQuantity).toHaveBeenCalledWith('user-1', 'product-1', 5);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ items: [{ product: 'product-1', quantity: 5 }] });
	});

	it('clearCartController vacía el carrito', async () => {
		clearCart.mockResolvedValue({ items: [] });

		await clearCartController(req, res, next);

		expect(clearCart).toHaveBeenCalledWith('user-1');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ items: [] });
	});

	it('propaga errores al next', async () => {
		const error = new Error('boom');
		getCartByUserId.mockRejectedValue(error);

		await getCart(req, res, next);

		expect(next).toHaveBeenCalledWith(error);
	});
});
