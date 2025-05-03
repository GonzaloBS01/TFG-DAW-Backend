import Product from '../../models/products.js';

export async function saveProduct(product) {
  try {
    const newProduct = new Product(product);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error(`Error al guardar el producto: ${error.message}`);
  }
}
export async function getAllProducts() {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error(`Error al obtener los productos: ${error.message}`);
  }
}
export async function getProductById(id) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }
  catch (error) {
    throw new Error(`Error al obtener el producto: ${error.message}`);
  }
}
export async function updateProduct(id, product) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    if (!updatedProduct) {
      throw new Error('Producto no encontrado');
    }
    return updatedProduct;
  }
  catch (error) {
    throw new Error(`Error al actualizar el producto: ${error.message}`);
  }
}
export async function deleteProduct(id) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new Error('Producto no encontrado');
    }
    return deletedProduct;
  }
  catch (error) {
    throw new Error(`Error al eliminar el producto: ${error.message}`);
  }
}
