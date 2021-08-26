import express from "express";
import userController from '../controllers/user.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { userRoles } from '../utils/userRoles.utils.js';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware.js';
import { createUserSchema, updateUserSchema, validateLogin } from '../middleware/validators/userValidator.middleware.js';

const router = express.Router();



router.post( '/login', validateLogin, awaitHandlerFactory( userController.userLogin ) );



router.get( '/', auth(), awaitHandlerFactory( userController.getAllUsers ) );

router.get( '/id/:id', auth(), awaitHandlerFactory( userController.getUserById ) );
router.get( '/username/:username', auth(), awaitHandlerFactory( userController.getUserByuserName ) );
router.get( '/whoami', auth(), awaitHandlerFactory( userController.getCurrentUser ) );
router.post( '/', createUserSchema, awaitHandlerFactory( userController.createUser ) );
router.patch( '/id/:id', auth( userRoles.Admin ), updateUserSchema, awaitHandlerFactory( userController.updateUser ) );
router.delete( '/id/:id', auth( userRoles.Admin ), awaitHandlerFactory( userController.deleteUser ) );



export default router;