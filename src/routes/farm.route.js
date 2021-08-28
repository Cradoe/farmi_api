import express from "express";
import farmController from "../controllers/farm.controller.js";
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware.js';
import { createFarmSchema, updateFarmSchema } from "../middleware/validators/farmValidator.middleware.js";
import { auth } from '../middleware/auth.middleware.js';


const router = express.Router();


router.post( '/', auth(), createFarmSchema, awaitHandlerFactory( farmController.createFarm ) );
router.post( '/create', auth(), createFarmSchema, awaitHandlerFactory( farmController.createFarm ) );
router.patch( '/edit/:id', auth(), updateFarmSchema, awaitHandlerFactory( farmController.editFarm ) );
router.delete( '/delete/:id', auth(), awaitHandlerFactory( farmController.deleteFarm ) );




export default router;