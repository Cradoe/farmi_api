const express = require( "express" );
const accountController = require( '../controllers/account.controller.js' );
const { auth } = require( "../middleware/auth.middleware.js" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { farmerAccountType, farmModeratorAccountType } = require( "../middleware/requestAccountType.middleware.js" );
const { addBankAccountSchema } = require( "../middleware/validators/bankAccount.middleware.js" );
const { createAccountSchema, validateLogin, activateAccountSchema, createFarmModeratorSchema } = require( '../middleware/validators/userValidator.middleware.js' );

const router = express.Router();



router.post( '/verify', activateAccountSchema, awaitHandlerFactory( accountController.activateAccount ) );

router.post( '/farmer/login', validateLogin, awaitHandlerFactory( accountController.farmerLogin ) );
router.post( '/farmer/register', createAccountSchema, farmerAccountType, awaitHandlerFactory( accountController.createFarmerAccount ) );

router.post( '/farm_moderator/register', farmModeratorAccountType, awaitHandlerFactory( accountController.createFarmModeratorAccount ) );
router.post( '/farm_moderator/login', validateLogin, awaitHandlerFactory( accountController.farmModeratorLogin ) );


router.post( '/bank', auth(), addBankAccountSchema, awaitHandlerFactory( accountController.addBankAccount ) );
router.delete( '/bank/delete/:id', auth(), awaitHandlerFactory( accountController.deleteBankAccount ) );

module.exports = router;