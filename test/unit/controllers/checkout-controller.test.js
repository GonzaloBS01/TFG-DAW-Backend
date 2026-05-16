import { processCheckout } from '../../../src/controllers/checkout-controller.js';
import { getCartByUserId, processCartToOrder } from '../../../src/services/mongodb/cart-service.js';
import { saveBill, getBillById } from '../../../src/services/mongodb/bill-service.js';
import { getUserById } from '../../../src/services/mongodb/user-service.js';
import { generateBillPDF } from '../../../src/services/pdf/pdf-service.js';
import emailService from '../../../src/services/email/email-service.js';
import Product from '../../../src/models/products.js';

jest.mock('../../../src/services/mongodb/cart-service.js', () => ({
  __esModule: true,
  getCartByUserId: jest.fn(),
  processCartToOrder: jest.fn(),
}));

jest.mock('../../../src/services/mongodb/bill-service.js', () => ({
  __esModule: true,
  saveBill: jest.fn(),
  getBillById: jest.fn(),
}));

jest.mock('../../../src/services/mongodb/user-service.js', () => ({
  __esModule: true,
  getUserById: jest.fn(),
}));

jest.mock('../../../src/services/pdf/pdf-service.js', () => ({
  __esModule: true,
  generateBillPDF: jest.fn(),
}));

jest.mock('../../../src/services/email/email-service.js', () => ({
  __esModule: true,
  default: {
    sendPurchaseConfirmationEmail: jest.fn(),
    sendPurchaseConfirmationEmailWithPDF: jest.fn(),
  },
}));

jest.mock('../../../src/models/products.js', () => ({
  __esModule: true,
  default: {
    updateMany: jest.fn(),
  },
}));

function buildCart(items = []) {
  return {
    _id: 'cart-1',
    items,
    total: 125,
  };
}

function buildBill() {
  return {
    _id: 'bill-1',
    totalAmount: 125,
    createdAt: new Date('2026-04-28T10:00:00.000Z'),
    products: [],
    user: 'user-1',
    status: 'paid',
  };
}

describe('checkout-controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      user: { id: 'user-1' },
      body: {
        paymentMethod: 'card',
        billingAddress: 'Calle Principal 123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('devuelve 400 si el carrito está vacío', async () => {
    getCartByUserId.mockResolvedValue(buildCart([]));

    await processCheckout(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'El carrito está vacío' });
    expect(saveBill).not.toHaveBeenCalled();
    expect(Product.updateMany).not.toHaveBeenCalled();
    expect(processCartToOrder).not.toHaveBeenCalled();
    expect(generateBillPDF).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('crea factura con status: paid', async () => {
    const cart = buildCart([
      {
        product: { _id: 'product-1' },
        quantity: 2,
        price: 25,
      },
    ]);
    getCartByUserId.mockResolvedValue(cart);
    saveBill.mockResolvedValue({ _id: 'bill-1', totalAmount: 125 });
    getBillById.mockResolvedValue(buildBill());
    getUserById.mockResolvedValue({ _id: 'user-1', name: 'Ana', email: 'ana@test.com' });
    processCartToOrder.mockResolvedValue({});
    generateBillPDF.mockResolvedValue(Buffer.from('pdf'));

    await processCheckout(req, res, next);

    expect(saveBill).toHaveBeenCalledWith(expect.objectContaining({
      user: 'user-1',
      status: 'paid',
      paymentMethod: 'card',
      billingAddress: 'Calle Principal 123',
    }));
  });

  it('llama a Product.updateMany para marcar productos como sold', async () => {
    const cart = buildCart([
      { product: { _id: 'product-1' }, quantity: 1, price: 25 },
      { product: { _id: 'product-2' }, quantity: 2, price: 50 },
    ]);
    getCartByUserId.mockResolvedValue(cart);
    saveBill.mockResolvedValue({ _id: 'bill-1', totalAmount: 125 });
    getBillById.mockResolvedValue(buildBill());
    getUserById.mockResolvedValue({ _id: 'user-1', name: 'Ana', email: 'ana@test.com' });
    generateBillPDF.mockResolvedValue(Buffer.from('pdf'));

    await processCheckout(req, res, next);

    expect(Product.updateMany).toHaveBeenCalledWith(
      { _id: { $in: ['product-1', 'product-2'] } },
      { $set: { status: 'sold' } },
    );
  });

  it('llama a processCartToOrder', async () => {
    const cart = buildCart([
      { product: { _id: 'product-1' }, quantity: 1, price: 25 },
    ]);
    getCartByUserId.mockResolvedValue(cart);
    saveBill.mockResolvedValue({ _id: 'bill-1', totalAmount: 125 });
    getBillById.mockResolvedValue(buildBill());
    getUserById.mockResolvedValue({ _id: 'user-1', name: 'Ana', email: 'ana@test.com' });
    generateBillPDF.mockResolvedValue(Buffer.from('pdf'));

    await processCheckout(req, res, next);

    expect(processCartToOrder).toHaveBeenCalledWith('user-1');
  });

  it('devuelve 201 con orderId, bill, total y downloadUrl', async () => {
    const cart = buildCart([
      { product: { _id: 'product-1' }, quantity: 1, price: 25 },
    ]);
    const bill = { _id: 'bill-1', totalAmount: 125 };
    getCartByUserId.mockResolvedValue(cart);
    saveBill.mockResolvedValue(bill);
    getBillById.mockResolvedValue(buildBill());
    getUserById.mockResolvedValue({ _id: 'user-1', name: 'Ana', email: 'ana@test.com' });
    generateBillPDF.mockResolvedValue(Buffer.from('pdf'));

    await processCheckout(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Compra procesada exitosamente',
      orderId: 'bill-1',
      bill,
      total: 125,
      downloadUrl: '/api/v1/bills/bill-1/download',
    });
  });

  it('si falla generateBillPDF, sigue el flujo y manda email sin PDF', async () => {
    const cart = buildCart([
      { product: { _id: 'product-1' }, quantity: 1, price: 25 },
    ]);
    const bill = buildBill();
    const user = { _id: 'user-1', name: 'Ana', email: 'ana@test.com' };
    getCartByUserId.mockResolvedValue(cart);
    saveBill.mockResolvedValue({ _id: 'bill-1', totalAmount: 125 });
    getBillById.mockResolvedValue(bill);
    getUserById.mockResolvedValue(user);
    generateBillPDF.mockRejectedValue(new Error('pdf error'));

    await processCheckout(req, res, next);

    expect(emailService.sendPurchaseConfirmationEmail).toHaveBeenCalledWith(user, bill);
    expect(emailService.sendPurchaseConfirmationEmailWithPDF).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('si hay PDF, llama a sendPurchaseConfirmationEmailWithPDF', async () => {
    const cart = buildCart([
      { product: { _id: 'product-1' }, quantity: 1, price: 25 },
    ]);
    const bill = buildBill();
    const user = { _id: 'user-1', name: 'Ana', email: 'ana@test.com' };
    const pdfBuffer = Buffer.from('pdf');
    getCartByUserId.mockResolvedValue(cart);
    saveBill.mockResolvedValue({ _id: 'bill-1', totalAmount: 125 });
    getBillById.mockResolvedValue(bill);
    getUserById.mockResolvedValue(user);
    generateBillPDF.mockResolvedValue(pdfBuffer);

    await processCheckout(req, res, next);

    expect(emailService.sendPurchaseConfirmationEmailWithPDF).toHaveBeenCalledWith(user, bill, pdfBuffer);
    expect(emailService.sendPurchaseConfirmationEmail).not.toHaveBeenCalled();
  });
});
