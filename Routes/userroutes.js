const express = require('express')
const Router = express.Router();
const Usercontroller = require('../Controllers/usercontroller')
const authToken = require('../Middleware/authmiddleware')
const authorizeRole = require('../Middleware/authorizeRole');
const apiLimiter = require("../Middleware/rateLimiter");

const validate = require("../Middleware/validationMiddleware");

const {
 signupValidation,
 loginValidation,
 tokenValidation,
 userIdParamValidation
} = require("../Validators/userValidator");

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create New User
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - id
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ravi
 *               id:
 *                 type: string
 *                 example: EMP001
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User Created Successfully
 *       400:
 *         description: Bad Request
 */
Router.post('/signup',signupValidation, validate, Usercontroller.signup)


/**
 * @swagger
 * /login:
 *   post:
 *     summary: login
 *     tags : [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rocky
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User Login Successfully
 *       400:
 *         description: Bad Request
 */
Router.post('/login', apiLimiter, loginValidation, validate, Usercontroller.login)


/**
 * @swagger
 * /token:
 *   post:
 *     summary: login
 *     tags : [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: tokensample
 *     responses:
 *       201:
 *         description: Token generated successfully
 *       400:
 *         description: Bad Request
 */
Router.post('/token',tokenValidation, validate, Usercontroller.getToken)


/**
 * @swagger
 * /logout:
 *   delete:
 *     summary: logout
 *     tags : [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: tokensample
 *     responses:
 *       201:
 *         description: Token generated successfully
 *       400:
 *         description: Bad Request
 */
Router.delete('/logout', Usercontroller.logout)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get All Users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized
 */
Router.get('/users', authToken, authorizeRole("admin","manager", "user"), Usercontroller.getuser)

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get User By ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 2
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
Router.get('/user/:id', authToken, authorizeRole("admin","manager","user"), userIdParamValidation, validate, Usercontroller.getuserid)


/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete User By ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 2
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
Router.delete('/user/:id', authToken, authorizeRole("admin"), userIdParamValidation, validate, Usercontroller.deleteuser)







module.exports= Router;
