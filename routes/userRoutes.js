const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');
const { registerSchema, loginSchema, roleSchema } = require('../schema/userValidation');

// Register a new user
/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       description: User registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/users/register', registerSchema, userController.register);

// Authenticate a user and return a JWT
/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Authenticate a user and return a JWT
 *     tags: [User]
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: JWT token returned
 *       401:
 *         description: Unauthorized
 */
router.post('/users/login', loginSchema, userController.login);

// Assign a role to a user (Admin only)
/**
 * @openapi
 * /users/role:
 *   post:
 *     summary: Assign a role to a user (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Role assignment details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       403:
 *         description: Forbidden
 */
router.post('/users/role', verifyToken, authorize(['assign_role']), roleSchema, userController.assignRole);

module.exports = router;
