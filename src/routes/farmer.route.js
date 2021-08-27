import express from "express";
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware.js';
import { auth } from '../middleware/auth.middleware.js';
import farmerController from "../controllers/farmer.controller.js";

const router = express.Router();


router.get( '/farms', auth(), awaitHandlerFactory( farmerController.listFarms ) );



export default router;