import PDFDocument from 'pdfkit';
import logger from '../../utils/logger.js';

/**
 * Genera un PDF de factura en memoria y retorna un Buffer
 * @param {Object} bill - Documento de factura poblado con user y products
 * @param {Object} user - Documento de usuario
 * @returns {Promise<Buffer>} Buffer PDF de la factura
 */
export async function generateBillPDF(bill, user) {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks = [];

      // Capturar output stream en chunks
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // ============================================
      // HEADER - Título y número de factura
      // ============================================
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('FACTURA', { align: 'center' })
        .fontSize(10)
        .font('Helvetica')
        .text(`Nº Pedido: ${bill._id}`, { align: 'center' })
        .text(`Fecha: ${formatDate(bill.createdAt)}`, { align: 'center' });

      doc.moveTo(40, doc.y).lineTo(540, doc.y).stroke();
      doc.moveDown();

      // ============================================
      // INFORMACIÓN DEL CLIENTE
      // ============================================
      doc.fontSize(12).font('Helvetica-Bold').text('Cliente');
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`${user.name}`)
        .text(`Email: ${user.email}`);

      if (bill.billingAddress) {
        doc.text(`Dirección: ${bill.billingAddress}`);
      }

      doc.moveDown();

      // ============================================
      // TABLA DE PRODUCTOS
      // ============================================
      doc.fontSize(12).font('Helvetica-Bold').text('Productos Comprados');
      doc.moveDown(0.5);

      // Headers de tabla
      const headers = ['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal'];
      const col1 = 50;
      const col2 = 320;
      const col3 = 400;
      const col4 = 480;

      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .text(headers[0], col1, doc.y)
        .text(headers[1], col2, doc.y)
        .text(headers[2], col3, doc.y)
        .text(headers[3], col4, doc.y);

      doc.moveTo(40, doc.y + 2).lineTo(540, doc.y + 2).stroke();
      doc.moveDown(0.8);

      // Filas de productos
      let totalSubtotal = 0;
      bill.products.forEach(item => {
        const subtotal = item.quantity * item.price;
        totalSubtotal += subtotal;

        const productName = item.product.name || 'Producto sin nombre';
        doc
          .fontSize(9)
          .font('Helvetica')
          .text(productName.substring(0, 35), col1, doc.y)
          .text(item.quantity.toString(), col2, doc.y)
          .text(formatCurrency(item.price), col3, doc.y)
          .text(formatCurrency(subtotal), col4, doc.y);
      });

      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(540, doc.y).stroke();

      // ============================================
      // TOTALES CON IVA
      // ============================================
      doc.moveDown(0.5);

      const iva = bill.totalAmount - totalSubtotal;
      const ivaPercentage = totalSubtotal > 0 ? ((iva / totalSubtotal) * 100).toFixed(0) : '0';

      // Alineación a la derecha
      const rightX = 450;
      const labelX = 350;

      doc
        .fontSize(10)
        .font('Helvetica')
        .text('Subtotal:', labelX, doc.y, { width: 100 })
        .text(formatCurrency(totalSubtotal), rightX, doc.y - 12, {
          align: 'right',
          width: 80
        });

      doc
        .moveDown()
        .text(`IVA (${ivaPercentage}%):`, labelX, doc.y, { width: 100 })
        .text(formatCurrency(iva), rightX, doc.y - 12, {
          align: 'right',
          width: 80
        });

      doc.moveDown();
      doc.moveTo(280, doc.y).lineTo(540, doc.y).stroke();

      doc
        .moveDown(0.3)
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('TOTAL:', labelX, doc.y, { width: 100 })
        .text(formatCurrency(bill.totalAmount), rightX, doc.y - 12, {
          align: 'right',
          width: 80,
          underline: true
        });

      // ============================================
      // INFORMACIÓN ADICIONAL
      // ============================================
      doc.moveDown(1.5);
      doc
        .fontSize(9)
        .font('Helvetica')
        .text(`Método de pago: ${bill.paymentMethod || 'No especificado'}`);

      doc.text(
        `Estado del pedido: ${
          bill.status === 'paid' ? 'Pagado' : bill.status === 'pending' ? 'Pendiente' : 'Cancelado'
        }`
      );

      // ============================================
      // FOOTER - Mensaje de cierre
      // ============================================
      doc.moveDown(1);
      doc.moveTo(40, doc.y).lineTo(540, doc.y).stroke();
      doc.moveDown(0.5);

      doc
        .fontSize(8)
        .font('Helvetica')
        .text('Gracias por tu compra. Esta factura es válida sin firma.', {
          align: 'center',
          color: '#666666'
        });

      doc.fontSize(7).text('Kátodo Ciberjoyería - Factura generada automáticamente', {
        align: 'center',
        color: '#999999'
      });

      // Finalizar documento
      doc.end();
    });
  } catch (error) {
    logger.error(`Error al generar PDF de factura: ${error.message}`);
    throw new Error(`No se pudo generar la factura PDF: ${error.message}`);
  }
}

/**
 * Formatea un monto de dinero a formato EUR
 * @param {number} amount - Cantidad en euros
 * @returns {string} Cantidad formateada como €XX.XX
 */
function formatCurrency(amount) {
  return `€${Number(amount).toFixed(2)}`;
}

/**
 * Formatea una fecha al formato DD/MM/YYYY HH:MM con locale español
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default {
  generateBillPDF
};
