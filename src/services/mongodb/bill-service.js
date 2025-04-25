import Bill from '../../models/bill.js';

export async function saveBill(bill) {
  try {
    const newBill = new Bill(bill);
    await newBill.save();
    return newBill;
  } catch (error) {
    throw new Error(`Error al guardar la factura: ${ error.message}`);
  }
}


