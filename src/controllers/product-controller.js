import { saveProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../services/mongodb/product-service.js';


export async function createProduct(req, res, next) {
  try {
    const savedProduct = await saveProduct(req.body);
    res.status(201).json(savedProduct);
  } catch (error) {
    error.status = 400;
    error.message = 'Error al crear el producto';
    next(error);
  }
}
export async function getAllProductsController(req, res, next) {
  try {
    const allProducts = await getAllProducts();
    res.status(200).json(allProducts);
  } catch (error) {
    error.status = 500;
    error.message = 'Error al obtener los productos';
    next(error);
  }
}
export async function getProductByIdController(req, res, next) {
  try {
    const productByID = await getProductById(req.params.id);
    if (!productByID) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(productByID);
  } catch (error) {
    error.status = 500;
    error.message = 'Error al obtener el producto';
    next(error);
  }
}
export async function updateProductController(req, res, next) {
  try {
    const product = await updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    error.status = 500;
    error.message = 'Error al actualizar el producto';
    next(error);
  }
}
export async function deleteProductController(req, res, next) {
  try {
    const product = await deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    error.status = 500;
    error.message = 'Error al eliminar el producto';
    next(error);
  }
}
