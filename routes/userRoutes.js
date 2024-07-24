const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// Register a new user
router.post('/users/register', userController.register);

// Authenticate a user and return a JWT
router.post('/users/login', userController.login);

// Assign a role to a user (Admin only)
router.post('/users/role', verifyToken, authorize(['assign_role']), userController.assignRole);

module.exports = router;
