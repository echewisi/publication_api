const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');
const { registerSchema, loginSchema, roleSchema } = require('../schema/userValidation');
const validationMiddleware= require('../middlewares/validation')

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
// Register a new user
/**
 * @swagger
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
router.post('/users/register',  validationMiddleware(registerSchema) , userController.register);

// Authenticate a user and return a JWT
/**
 * @swagger
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
router.post('/users/login', validationMiddleware(loginSchema), userController.login);

// Assign a role to a user (Admin only)
/**
 * @swagger
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
router.post('/users/role', verifyToken, authorize(['assign_role']), validationMiddleware(roleSchema), userController.assignRole);

module.exports = router;
