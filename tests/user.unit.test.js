const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserController = require('../controllers/userController');
const User = require('../models/User');

jest.mock('../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserController.register', () => {
  it('should return 400 if email or password is missing', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await UserController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email, password, name and last name are required' });
  });

  it('should return 400 if user already exists', async () => {
    User.findOne.mockResolvedValue(true);
    const req = { body: { email: 'test@test.com', password: '123456', name: 'test', lastname: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await UserController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already registered.' });
  });

  it('should create user and return 201', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed');
    User.create.mockResolvedValue({ email: 'test@test.com' });
    const req = { body: { email: 'test@test.com', password: '123456', name: 'test', lastname: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await UserController.register(req, res);

    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith("User registered successfully");
  });

  it('should return 500 on unexpected error', async () => {
    User.findOne.mockRejectedValue(new Error('DB fail'));
    const req = { body: { email: 'fail@test.com', password: '123', name: 'test', lastname: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await UserController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'DB fail' });
  });
});

describe('UserController.login', () => {
  it('should return 400 if email or password is missing', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await UserController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });

  it('should return 400 if user not found', async () => {
    User.findOne.mockResolvedValue(null);
    const req = { body: { email: 'not@found.com', password: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await UserController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials.' });
  });

  it('should return 400 if password invalid', async () => {
    User.findOne.mockResolvedValue({ password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);
    const req = { body: { email: 'test@test.com', password: 'wrong' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await UserController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials.' });
  });

  it('should return token on successful login', async () => {
    User.findOne.mockResolvedValue({ id: 1, password: 'hashed' });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');
    const req = { body: { email: 'test@test.com', password: '123456' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await UserController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: 'token' });
  });

  it('should return 500 on unexpected error', async () => {
    User.findOne.mockRejectedValue(new Error('DB error'));
    const req = { body: { email: 'fail@test.com', password: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await UserController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
  });
});