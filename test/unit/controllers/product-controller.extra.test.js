import {
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from '../../../src/controllers/product-controller.js';
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from '../../../src/services/mongodb/product-service.js';

jest.mock('../../../src/services/mongodb/product-service.js', () => ({
  __esModule: true,
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

describe('product-controller extra cases', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('propaga error en getProductByIdController', async () => {
    const error = new Error('db fail');
    getProductById.mockRejectedValueOnce(error);
    req.params.id = 'p-1';

    await getProductByIdController(req, res, next);

    expect(getProductById).toHaveBeenCalledWith('p-1');
    expect(next).toHaveBeenCalledWith(error);
    expect(error.status).toBe(500);
    expect(error.message).toBe('Error al obtener el producto');
  });

  it('propaga error en updateProductController', async () => {
    const error = new Error('update fail');
    updateProduct.mockRejectedValueOnce(error);
    req.params.id = 'p-1';
    req.body = { name: 'X' };

    await updateProductController(req, res, next);

    expect(updateProduct).toHaveBeenCalledWith('p-1', { name: 'X' });
    expect(next).toHaveBeenCalledWith(error);
    expect(error.status).toBe(500);
    expect(error.message).toBe('Error al actualizar el producto');
  });

  it('propaga error en deleteProductController', async () => {
    const error = new Error('delete fail');
    deleteProduct.mockRejectedValueOnce(error);
    req.params.id = 'p-1';

    await deleteProductController(req, res, next);

    expect(deleteProduct).toHaveBeenCalledWith('p-1');
    expect(next).toHaveBeenCalledWith(error);
    expect(error.status).toBe(500);
    expect(error.message).toBe('Error al eliminar el producto');
  });
});
