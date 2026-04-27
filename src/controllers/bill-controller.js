import { HttpStatusError } from 'common-errors';
import { saveBill, getAllBills, getBillById, updateBill, deleteBill } from '../services/mongodb/bill-service.js';
import { generateBillPDF } from '../services/pdf/pdf-service.js';

export async function createBill(req, res, next) {
  try {
    const savedBill = saveBill(req.body);
    res.status(201).json(savedBill);
  } catch (error) {
    next(new HttpStatusError(400, 'Error al crear la factura'));
  }
}

export async function getAllBillsController(req, res, next) {
  try {
    const allBills = await getAllBills();
    res.status(200).json(allBills);
  } catch (error) {
    error.message = 'Error al obtener las facturas';
    next(error);
  }
}

export async function getBillByIdController(req, res, next) {
  try {
    const billByID = await getBillById(req.params.id);
    if (!billByID) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.status(200).json(billByID);
  } catch (error) {
    error.message = 'Error al obtener la factura';
    next(error);
  }
}
export async function updateBillController(req, res, next) {
  try {
    const bill = await updateBill(req.params.id, req.body);
    if (!bill) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.status(200).json(bill);
  } catch (error) {
    error.status = 500;
    error.message = 'Error al actualizar la factura';
    next(error);
  }
}
export async function deleteBillController(req, res, next) {
  try {
    const bill = await deleteBill(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.status(204).send();
  }
  catch (error) {
    error.status = 500;
    error.message = 'Error al eliminar la factura';
    next(error);
  }
}

export async function downloadBillPDF(req, res, next) {
  try {
    const billId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Obtener factura con datos poblados
    const bill = await getBillById(billId);

    if (!bill) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    // Validar autorización: ser el propietario o admin
    const isOwner = bill.user._id.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'No tienes permisos para descargar esta factura' });
    }

    // Generar PDF
    const pdfBuffer = await generateBillPDF(bill, bill.user);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(500).json({ error: 'Error al generar el PDF de la factura' });
    }

    // Configurar headers para descarga de archivo
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="factura-${bill._id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    error.message = 'Error al descargar la factura PDF';
    next(error);
  }
}
