import { saveBill , getAllBills , getBillById, updateBill, deleteBill } from '../services/mongodb/bill-service.js';

export async function createBill(req, res, next) {
    try {
      const savedBill = saveBill(req.body);
      res.status(201).json(savedBill);
    } catch (error) {
      error.status = 400;
      error.message = 'Error al crear la factura';
      next(error);
    }
}

export async function getAllBillsController(req, res, next) {
    try {
        const allBills = await getAllBills();
        res.status(200).json(allBills);
    } catch (error) {
        error.status = 500;
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
        error.status = 500;
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
