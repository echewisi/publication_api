const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');
const { registerSchema, loginSchema, roleSchema } = require('../schema/userValidation');

// Register a new user
router.post('/users/register', registerSchema, userController.register);

// Authenticate a user and return a JWT
router.post('/users/login', loginSchema, userController.login);

// Assign a role to a user (Admin only)
router.post('/users/role', verifyToken, authorize(['assign_role']), roleSchema, userController.assignRole);

module.exports = router;
