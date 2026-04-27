import { getCartByUserId, processCartToOrder } from '../services/mongodb/cart-service.js';
import { saveBill, getBillById } from '../services/mongodb/bill-service.js';
import emailService from '../services/email/email-service.js';
import { getUserById } from '../services/mongodb/user-service.js';
import { generateBillPDF } from '../services/pdf/pdf-service.js';
import Product from '../models/products.js';

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
      status: 'paid',
      paymentMethod: req.body.paymentMethod || 'card',
      billingAddress: req.body.billingAddress,
    };

    // 3. Guardar la factura
    const bill = await saveBill(billData);

    // 4. Marcar los productos comprados como "vendidos"
    const productIds = cart.items.map(item => item.product._id);
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { status: 'sold' } },
    );

    // 5. Marcar carrito como procesado
    await processCartToOrder(userId);

    // 6. Obtener factura poblada y usuario para generar PDF
    const billPopulated = await getBillById(bill._id);
    const user = await getUserById(userId);

    // 7. Generar PDF de la factura
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateBillPDF(billPopulated, user);
    } catch (pdfError) {
      // Log del error pero continuar el flujo - el checkout no falla si el PDF falla
      console.error(`Error al generar PDF: ${pdfError.message}`);
    }

    // 8. Enviar correo de confirmación con PDF adjunto
    if (pdfBuffer) {
      await emailService.sendPurchaseConfirmationEmailWithPDF(user, billPopulated, pdfBuffer);
    } else {
      // Fallback a email sin PDF si ocurrió error
      await emailService.sendPurchaseConfirmationEmail(user, billPopulated);
    }

    res.status(201).json({
      message: 'Compra procesada exitosamente',
      orderId: bill._id,
      bill: bill,
      total: bill.totalAmount,
      downloadUrl: `/api/v1/bills/${bill._id}/download`,
    });

  } catch (error) {
    next(error);
  }
}
