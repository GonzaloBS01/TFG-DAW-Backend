import {
  getCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCartController,
} from '../../../src/controllers/cart-controller.js';

import * as cartService from '../../../src/services/mongodb/cart-service.js';

jest.mock('../../../src/services/mongodb/cart-service.js', () => ({
  __esModule: true,
  getCartByUserId: jest.fn(),
  addItemToCart: jest.fn(),
  removeItemFromCart: jest.fn(),
  updateItemQuantity: jest.fn(),
  clearCart: jest.fn(),
}));

describe('cart-controller (unit)', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { user: { id: 'user-1' }, body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('getCart responde 200 con el carrito', async () => {
    cartService.getCartByUserId.mockResolvedValue({ items: [] });

    await getCart(req, res, next);

    expect(cartService.getCartByUserId).toHaveBeenCalledWith('user-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ items: [] });
    expect(next).not.toHaveBeenCalled();
  });

  it('addItem llama al servicio y responde 200', async () => {
    req.body = { productId: 'p1', quantity: 3 };
    cartService.addItemToCart.mockResolvedValue({ items: [{ productId: 'p1', quantity: 3 }] });

    await addItem(req, res, next);

    expect(cartService.addItemToCart).toHaveBeenCalledWith('user-1', 'p1', 3);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ items: [{ productId: 'p1', quantity: 3 }] });
  });

  it('removeItem propaga errores a next', async () => {
    req.params.productId = 'pX';
    const err = new Error('remove fail');
    cartService.removeItemFromCart.mockRejectedValue(err);

    await removeItem(req, res, next);

    expect(cartService.removeItemFromCart).toHaveBeenCalledWith('user-1', 'pX');
    expect(next).toHaveBeenCalledWith(err);
  });

  it('updateQuantity actualiza y responde', async () => {
    req.params.productId = 'pY';
    req.body.quantity = 7;
    cartService.updateItemQuantity.mockResolvedValue({ items: [{ productId: 'pY', quantity: 7 }] });

    await updateQuantity(req, res, next);

    expect(cartService.updateItemQuantity).toHaveBeenCalledWith('user-1', 'pY', 7);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ items: [{ productId: 'pY', quantity: 7 }] });
  });

  it('clearCartController limpia y responde', async () => {
    cartService.clearCart.mockResolvedValue({ items: [] });

    await clearCartController(req, res, next);

    expect(cartService.clearCart).toHaveBeenCalledWith('user-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ items: [] });
  });
});
