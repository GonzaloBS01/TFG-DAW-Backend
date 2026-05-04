import ShoppingCart from '../../../src/models/shopping-cart.js';
import { getProductById } from '../../../src/services/mongodb/product-service.js';
import {
	addItemToCart,
	clearCart,
	getCartByUserId,
	processCartToOrder,
	removeItemFromCart,
	updateItemQuantity,
} from '../../../src/services/mongodb/cart-service.js';

jest.mock('../../../src/models/shopping-cart.js', () => ({
	__esModule: true,
	default: {
		findOne: jest.fn(),
		findOrCreateByUser: jest.fn(),
	},
}));

jest.mock('../../../src/services/mongodb/product-service.js', () => ({
	__esModule: true,
	getProductById: jest.fn(),
}));

describe('cart-service', () => {
	let cart;

	beforeEach(() => {
		cart = {
			items: [],
			save: jest.fn().mockResolvedValue(undefined),
			populate: jest.fn().mockResolvedValue(undefined),
			status: 'active',
		};
		jest.clearAllMocks();
	});

	describe('getCartByUserId', () => {
		it('usa findOrCreateByUser y hace populate', async () => {
			ShoppingCart.findOrCreateByUser.mockResolvedValue(cart);

			const result = await getCartByUserId('user-1');

			expect(ShoppingCart.findOrCreateByUser).toHaveBeenCalledWith('user-1');
			expect(cart.populate).toHaveBeenCalledWith('items.product');
			expect(result).toBe(cart);
		});
	});

	describe('addItemToCart', () => {
		it('añade producto nuevo al carrito', async () => {
			ShoppingCart.findOrCreateByUser.mockResolvedValue(cart);
			getProductById.mockResolvedValue({ price: 25 });

			const result = await addItemToCart('user-1', 'product-1', 2);

			expect(ShoppingCart.findOrCreateByUser).toHaveBeenCalledWith('user-1');
			expect(getProductById).toHaveBeenCalledWith('product-1');
			expect(cart.items).toEqual([
				{
					product: 'product-1',
					quantity: 2,
					price: 25,
				},
			]);
			expect(cart.save).toHaveBeenCalledTimes(1);
			expect(cart.populate).toHaveBeenCalledWith('items.product');
			expect(result).toBe(cart);
		});

		it('incrementa cantidad si el producto ya existe', async () => {
			cart.items = [
				{
					product: { toString: () => 'product-1' },
					quantity: 3,
					price: 25,
				},
			];
			ShoppingCart.findOrCreateByUser.mockResolvedValue(cart);
			getProductById.mockResolvedValue({ price: 25 });

			await addItemToCart('user-1', 'product-1', 2);

			expect(cart.items[0].quantity).toBe(5);
			expect(cart.items).toHaveLength(1);
			expect(cart.save).toHaveBeenCalledTimes(1);
		});
	});

	describe('removeItemFromCart', () => {
		it('elimina el item correcto', async () => {
			cart.items = [
				{ product: { toString: () => 'product-1' }, quantity: 1, price: 10 },
				{ product: { toString: () => 'product-2' }, quantity: 2, price: 20 },
			];
			ShoppingCart.findOne.mockResolvedValue(cart);

			const result = await removeItemFromCart('user-1', 'product-1');

			expect(ShoppingCart.findOne).toHaveBeenCalledWith({ user: 'user-1', status: 'active' });
			expect(cart.items).toHaveLength(1);
			expect(cart.items[0].product.toString()).toBe('product-2');
			expect(cart.items[0].quantity).toBe(2);
			expect(cart.items[0].price).toBe(20);
			expect(cart.save).toHaveBeenCalledTimes(1);
			expect(cart.populate).toHaveBeenCalledWith('items.product');
			expect(result).toBe(cart);
		});
	});

	describe('updateItemQuantity', () => {
		it('cambia la cantidad', async () => {
			cart.items = [
				{ product: { toString: () => 'product-1' }, quantity: 1, price: 10 },
				{ product: { toString: () => 'product-2' }, quantity: 2, price: 20 },
			];
			ShoppingCart.findOne.mockResolvedValue(cart);

			await updateItemQuantity('user-1', 'product-2', 5);

			expect(cart.items[1].quantity).toBe(5);
			expect(cart.items).toHaveLength(2);
			expect(cart.save).toHaveBeenCalledTimes(1);
			expect(cart.populate).toHaveBeenCalledWith('items.product');
		});

		it('elimina el item si quantity <= 0', async () => {
			cart.items = [
				{ product: { toString: () => 'product-1' }, quantity: 1, price: 10 },
				{ product: { toString: () => 'product-2' }, quantity: 2, price: 20 },
			];
			ShoppingCart.findOne.mockResolvedValue(cart);

			await updateItemQuantity('user-1', 'product-2', 0);

			expect(cart.items).toHaveLength(1);
			expect(cart.items[0].product.toString()).toBe('product-1');
			expect(cart.items[0].quantity).toBe(1);
			expect(cart.items[0].price).toBe(10);
			expect(cart.save).toHaveBeenCalledTimes(1);
		});
	});

	describe('clearCart', () => {
		it('deja items = []', async () => {
			cart.items = [
				{ product: { toString: () => 'product-1' }, quantity: 1, price: 10 },
			];
			ShoppingCart.findOne.mockResolvedValue(cart);

			const result = await clearCart('user-1');

			expect(cart.items).toEqual([]);
			expect(cart.save).toHaveBeenCalledTimes(1);
			expect(result).toBe(cart);
		});
	});

	describe('processCartToOrder', () => {
		it('cambia status a processed', async () => {
			ShoppingCart.findOne.mockResolvedValue(cart);

			const result = await processCartToOrder('user-1');

			expect(cart.status).toBe('processed');
			expect(cart.save).toHaveBeenCalledTimes(1);
			expect(result).toBe(cart);
		});
	});
});
