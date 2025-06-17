import { getCartByUserId, processCartToOrder } from '../services/mongodb/cart-service.js';
import { saveBill } from '../services/mongodb/bill-service.js';
import emailService from '../services/email/email-service.js';
import { getUserById } from '../services/mongodb/user-service.js';

export async function processCheckout(req, res, next) {
  try {
    const userId = req.user.id;

    // 1. Obtener carrito del usuario
    const cart = await getCartByUserId(userId);

    if (!cart.items.length) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    // 2. Crear la factura con los datos del carrito
    const billData = {
      user: userId,
      products: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.total,
      status: 'paid', // O el estado que manejes
      paymentMethod: req.body.paymentMethod || 'card',
      billingAddress: req.body.billingAddress,
    };

    // 3. Guardar la factura
    const bill = await saveBill(billData);

    // 4. Marcar carrito como procesado
    await processCartToOrder(userId);

    // 5. Enviar correo de confirmación (opcional)
    const user = await getUserById(userId);
    await emailService.sendPurchaseConfirmationEmail(user, bill);

    res.status(201).json({
      message: 'Compra procesada exitosamente',
      orderId: bill._id,
      bill: bill,
      total: bill.totalAmount,
    });

  } catch (error) {
    next(error);
  }
}
