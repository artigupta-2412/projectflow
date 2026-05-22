const { asyncHandler, sendSuccess, sendError } = require('../utils/response');
const { signupService, loginService, getMeService, getAllUsersService } = require('../services/auth.service');

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await signupService({ name, email, password, role });
  sendSuccess(res, result, 'Account created successfully', 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginService({ email, password });
  sendSuccess(res, result, 'Login successful');
});

const getMe = asyncHandler(async (req, res) => {
  const user = await getMeService(req.user.id);
  if (!user) return sendError(res, 'User not found', 404);
  sendSuccess(res, user, 'User retrieved');
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();
  sendSuccess(res, users, 'Users retrieved');
});

module.exports = { signup, login, getMe, getAllUsers };
