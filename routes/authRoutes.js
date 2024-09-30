const express = require("express");
const authController = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post('/register', authController.registerUser);
authRouter.post('/login', authController.loginUser);
authRouter.post('/login-official', authController.loginOfficial);

module.exports = authRouter;
