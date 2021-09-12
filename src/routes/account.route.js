const express = require( "express" );
const accountController = require( '../controllers/account.controller.js' );
const { auth } = require( "../middleware/auth.middleware.js" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { farmerAccountType, farmModeratorAccountType, investorAccountType } = require( "../middleware/requestAccountType.middleware.js" );
const { addBankAccountSchema } = require( "../middleware/validators/bankAccount.middleware.js" );
const { createAccountSchema, validateLogin, activateAccountSchema, createFarmModeratorSchema } = require( '../middleware/validators/userValidator.middleware.js' );
const uploadFile = require( "../services/uploadFile.service.js" );

const router = express.Router();


router.post( '/verify', activateAccountSchema, awaitHandlerFactory( accountController.activateAccount ) );

router.post( '/farmer/login', validateLogin, awaitHandlerFactory( accountController.farmerLogin ) );

router.post( '/farmer/register', uploadFile.single( 'profile_picture' ), createAccountSchema, farmerAccountType, awaitHandlerFactory( accountController.createFarmerAccount ) );

router.post( '/farm_moderator/register', auth(), uploadFile.single( 'profile_picture' ), createFarmModeratorSchema, farmModeratorAccountType, awaitHandlerFactory( accountController.createFarmModeratorAccount ) );
router.post( '/farm_moderator/login', validateLogin, awaitHandlerFactory( accountController.farmModeratorLogin ) );

router.post( '/investor/login', validateLogin, awaitHandlerFactory( accountController.investorLogin ) );
router.post( '/investor/register', uploadFile.single( 'profile_picture' ), createAccountSchema, investorAccountType, awaitHandlerFactory( accountController.createInvestorAccount ) );


router.post( '/bank', auth(), addBankAccountSchema, awaitHandlerFactory( accountController.addBankAccount ) );
router.get( '/bank/list', auth(), awaitHandlerFactory( accountController.getUserBankAccounts ) );
router.delete( '/bank/delete/:id', auth(), awaitHandlerFactory( accountController.deleteBankAccount ) );

module.exports = router;