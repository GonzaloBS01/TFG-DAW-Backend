import ShoppingCart from '../../models/shopping-cart.js';
import { getProductById } from './product-service.js';

export async function getCartByUserId(userId) {
  try {
    const cart = await ShoppingCart.findOrCreateByUser(userId);
    await cart.populate('items.product');
    return cart;
  } catch (error) {
    throw new Error(`Error al obtener el carrito: ${error.message}`);
  }
}

export async function addItemToCart(userId, productId, quantity = 1) {
  try {
    const cart = await ShoppingCart.findOrCreateByUser(userId);
    const product = await getProductById(productId);

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId,
    );

    if (existingItemIndex > -1) {
      // Actualizar cantidad
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Añadir nuevo item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product');
    return cart;
  } catch (error) {
    throw new Error(`Error al añadir producto al carrito: ${error.message}`);
  }
}

export async function removeItemFromCart(userId, productId) {
  try {
    const cart = await ShoppingCart.findOne({ user: userId, status: 'active' });
    if (!cart) throw new Error('Carrito no encontrado');

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');
    return cart;
  } catch (error) {
    throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
  }
}

export async function updateItemQuantity(userId, productId, quantity) {
  try {
    const cart = await ShoppingCart.findOne({ user: userId, status: 'active' });
    if (!cart) throw new Error('Carrito no encontrado');

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId,
    );

    if (itemIndex === -1) throw new Error('Producto no encontrado en el carrito');

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');
    return cart;
  } catch (error) {
    throw new Error(`Error al actualizar cantidad: ${error.message}`);
  }
}

export async function clearCart(userId) {
  try {
    const cart = await ShoppingCart.findOne({ user: userId, status: 'active' });
    if (!cart) throw new Error('Carrito no encontrado');

    cart.items = [];
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Error al vaciar el carrito: ${error.message}`);
  }
}

export async function processCartToOrder(userId) {
  try {
    const cart = await ShoppingCart.findOne({ user: userId, status: 'active' });
    if (!cart) throw new Error('Carrito no encontrado');

    cart.status = 'processed';
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Error al procesar el carrito: ${error.message}`);
  }
}
