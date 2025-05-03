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

export async function getAllBills() {
  try {
    const bills = await Bill.find().populate('user').populate('products');
    return bills;
  } catch (error) {
    throw new Error(`Error al obtener las facturas: ${ error.message}`);
  }
}
export async function getBillById(id) {
  try {
    const bill = await Bill.findById(id).populate('user').populate('products');
    if (!bill) {
      throw new Error('Factura no encontrada');
    }
    return bill;
  } catch (error) {
    throw new Error(`Error al obtener la factura: ${ error.message}`);
  }
}

export async function updateBill(id, bill) {
  try {
    const updatedBill = await Bill.findByIdAndUpdate (id, bill, { new: true }).populate('user').populate('products');
    if (!updatedBill) {
      throw new Error('Factura no encontrada');
    }
    return updatedBill;
  }
  catch (error) {
    throw new Error(`Error al actualizar la factura: ${ error.message}`);
  }
}
export async function deleteBill(id) {
  try {
    const deletedBill = await Bill.findByIdAndDelete(id);
    if (!deletedBill) {
      throw new Error('Factura no encontrada');
    }
    return deletedBill;
  } catch (error) {
    throw new Error(`Error al eliminar la factura: ${ error.message}`);
  }
}
