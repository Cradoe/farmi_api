const express = require( "express" );
const userController = require( '../controllers/user.controller.js' );
const { auth } = require( '../middleware/auth.middleware.js' );
const { userRoles } = require( '../utils/userRoles.utils.js' );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { createAccountSchema, updateUserSchema, validateLogin } = require( '../middleware/validators/userValidator.middleware.js' );

const router = express.Router();



router.post( '/login', validateLogin, awaitHandlerFactory( userController.userLogin ) );



router.get( '/', auth(), awaitHandlerFactory( userController.getAllUsers ) );

router.get( '/id/:id', auth(), awaitHandlerFactory( userController.getUserById ) );
router.get( '/username/:username', auth(), awaitHandlerFactory( userController.getUserByuserName ) );
router.get( '/whoami', auth(), awaitHandlerFactory( userController.getCurrentUser ) );
router.post( '/', createAccountSchema, awaitHandlerFactory( userController.createUser ) );
router.patch( '/id/:id', auth( userRoles.Admin ), updateUserSchema, awaitHandlerFactory( userController.updateUser ) );
router.delete( '/id/:id', auth( userRoles.Admin ), awaitHandlerFactory( userController.deleteUser ) );



export default router;