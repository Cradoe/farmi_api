import express from "express";
import userController from '../controllers/user.controller.js';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware.js';
import { createAccountSchema, validateLogin } from '../middleware/validators/userValidator.middleware.js';

const router = express.Router();


router.post( '/login', validateLogin, awaitHandlerFactory( userController.userLogin ) );


router.post( '/farmer/register', createAccountSchema, awaitHandlerFactory( userController.createFarmerAccount ) );


export default router;