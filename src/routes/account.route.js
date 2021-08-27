import express from "express";
import accountController from '../controllers/account.controller.js';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware.js';
import { farmerAccountType, investorAccountType } from "../middleware/requestAccountType.middleware.js";
import { createAccountSchema, validateLogin, activateAccountSchema } from '../middleware/validators/userValidator.middleware.js';

const router = express.Router();


router.post( '/login', validateLogin, awaitHandlerFactory( accountController.accountLogin ) );
router.post( '/verify', activateAccountSchema, awaitHandlerFactory( accountController.activateAccount ) );


router.post( '/farmer/register', createAccountSchema, farmerAccountType, awaitHandlerFactory( accountController.createAccount ) );
router.post( '/investor/register', createAccountSchema, investorAccountType, awaitHandlerFactory( accountController.createAccount ) );


export default router;