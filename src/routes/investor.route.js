const express = require( "express" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { auth } = require( '../middleware/auth.middleware.js' );
const investorController = require( "../controllers/investor.controller.js" );
const { withdrawalRequestSchema, confirmWithdrawalSchema } = require( "../middleware/validators/crowdFund.middleware.js" );

const router = express.Router();

router.get( '/investments', auth(), awaitHandlerFactory( investorController.getInvestments ) );

router.post( '/withdrawal/request', auth(), withdrawalRequestSchema, awaitHandlerFactory( investorController.initiateWithdrawal ) );
router.post( '/withdrawal/confirm', auth(), confirmWithdrawalSchema, awaitHandlerFactory( investorController.confirmWithdrawal ) );


module.exports = router;