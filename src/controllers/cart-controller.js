import {
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} from '../services/mongodb/cart-service.js';

export async function getCart(req, res, next) {
  try {
    const cart = await getCartByUserId(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function addItem(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    const cart = await addItemToCart(req.user.id, productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function removeItem(req, res, next) {
  try {
    const { productId } = req.params;
    const cart = await removeItemFromCart(req.user.id, productId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function updateQuantity(req, res, next) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await updateItemQuantity(req.user.id, productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function clearCartController(req, res, next) {
  try {
    const cart = await clearCart(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}
