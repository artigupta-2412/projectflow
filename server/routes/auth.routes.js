const express = require('express');
const router = express.Router();
const { signup, login, getMe, getAllUsers } = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { signupValidation, loginValidation } = require('../validations/auth.validation');

router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, getAllUsers); // For admin to list users when adding members

module.exports = router;
