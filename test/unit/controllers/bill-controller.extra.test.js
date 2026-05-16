import { downloadBillPDF } from '../../../src/controllers/bill-controller.js';
import * as billService from '../../../src/services/mongodb/bill-service.js';
import * as pdfService from '../../../src/services/pdf/pdf-service.js';

jest.mock('../../../src/services/mongodb/bill-service.js', () => ({
  __esModule: true,
  getBillById: jest.fn(),
}));

jest.mock('../../../src/services/pdf/pdf-service.js', () => ({
  __esModule: true,
  generateBillPDF: jest.fn(),
}));

describe('bill-controller downloadBillPDF', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { params: { id: 'bill-1' }, user: { id: 'user-1', role: 'user' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), setHeader: jest.fn(), send: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('devuelve 404 si no existe la factura', async () => {
    billService.getBillById.mockResolvedValue(null);

    await downloadBillPDF(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Factura no encontrada' });
  });

  it('devuelve 403 si no es owner ni admin', async () => {
    billService.getBillById.mockResolvedValue({ _id: 'bill-1', user: { _id: 'other-user' } });

    await downloadBillPDF(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'No tienes permisos para descargar esta factura' });
  });

  it('devuelve 500 si pdf vacío', async () => {
    billService.getBillById.mockResolvedValue({ _id: 'bill-1', user: { _id: 'user-1' } });
    pdfService.generateBillPDF.mockResolvedValue(Buffer.from(''));

    await downloadBillPDF(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al generar el PDF de la factura' });
  });

  it('envía PDF correctamente si es owner', async () => {
    const buf = Buffer.from('pdf-buf');
    billService.getBillById.mockResolvedValue({ _id: 'bill-1', user: { _id: 'user-1', name: 'Ana', email: 'a@x' }, products: [] });
    pdfService.generateBillPDF.mockResolvedValue(buf);

    await downloadBillPDF(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', expect.stringContaining('factura-bill-1.pdf'));
    expect(res.send).toHaveBeenCalledWith(buf);
  });
});
