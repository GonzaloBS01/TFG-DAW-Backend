import {
  createUser,
  deleteUserController,
} from '../../../src/controllers/user-controller.js';
import {
  saveUser,
  deleteUser,
} from '../../../src/services/mongodb/user-service.js';
import bcrypt from 'bcrypt';

jest.mock('../../../src/services/mongodb/user-service.js', () => ({
  __esModule: true,
  saveUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  __esModule: true,
  default: { hash: jest.fn() },
}));

describe('user-controller extra cases', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('createUser sin password guarda sin hashear', async () => {
    req.body = { username: 'no-pass' };
    saveUser.mockResolvedValueOnce({ _id: 'u1', username: 'no-pass' });

    await createUser(req, res, next);

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(saveUser).toHaveBeenCalledWith({ username: 'no-pass' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: 'u1', username: 'no-pass' });
  });

  it('deleteUserController propaga error si falla', async () => {
    const error = new Error('delete fail');
    deleteUser.mockRejectedValueOnce(error);
    req.params.id = 'u1';

    await deleteUserController(req, res, next);

    expect(deleteUser).toHaveBeenCalledWith('u1');
    expect(next).toHaveBeenCalledWith(error);
    expect(error.status).toBe(500);
    expect(error.message).toBe('Error al eliminar el usuario');
  });
});
