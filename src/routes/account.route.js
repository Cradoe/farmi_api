import express from "express";
import accountController from '../controllers/account.controller.js';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware.js';
import { farmerAccountType, farmModeratorAccountType } from "../middleware/requestAccountType.middleware.js";
import { createAccountSchema, validateLogin, activateAccountSchema, createFarmModeratorSchema } from '../middleware/validators/userValidator.middleware.js';

const router = express.Router();



router.post( '/verify', activateAccountSchema, awaitHandlerFactory( accountController.activateAccount ) );

router.post( '/farmer/login', validateLogin, awaitHandlerFactory( accountController.farmerLogin ) );
router.post( '/farmer/register', createAccountSchema, farmerAccountType, awaitHandlerFactory( accountController.createFarmerAccount ) );

router.post( '/farm_moderator/register', createFarmModeratorSchema, farmModeratorAccountType, awaitHandlerFactory( accountController.createFarmModeratorAccount ) );
router.post( '/farm_moderator/login', validateLogin, awaitHandlerFactory( accountController.farmModeratorLogin ) );

export default router;