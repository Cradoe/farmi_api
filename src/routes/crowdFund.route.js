const express = require( "express" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { auth } = require( '../middleware/auth.middleware.js' );
const { applyForCrowdFundSchema, investInCrowdFundSchema, withdrawalRequestSchema, confirmWithdrawalSchema } = require( "../middleware/validators/crowdFund.middleware.js" );
const crowdFundController = require( "../controllers/crowdFund.controller.js" );

const router = express.Router();

router.get( '/', auth(), awaitHandlerFactory( crowdFundController.getAllActiveCrowdFunds ) );
router.get( '/details/:crowd_fund_id', auth(), awaitHandlerFactory( crowdFundController.getDetailsOfCrowdFund ) );
router.get( '/farm/:farm_id', auth(), awaitHandlerFactory( crowdFundController.getAllFarmCrowdFunds ) );

router.post( '/apply', auth(), applyForCrowdFundSchema, awaitHandlerFactory( crowdFundController.applyForCrowdFund ) );

router.delete( '/delete/:id', auth(), awaitHandlerFactory( crowdFundController.deletePendingCrowdFund ) );

router.post( '/invest', auth(), investInCrowdFundSchema, awaitHandlerFactory( crowdFundController.investInCrowdFund ) );
router.get( '/investments/:crowd_fund_id', auth(), awaitHandlerFactory( crowdFundController.getCrowdFundInvestments ) );

router.post( '/withdrawal/request', auth(), withdrawalRequestSchema, awaitHandlerFactory( crowdFundController.initiateCrowdFundWithdrawal ) );
router.post( '/withdrawal/confirm', auth(), confirmWithdrawalSchema, awaitHandlerFactory( crowdFundController.confirmWithdrawal ) );

router.get( '/withdrawals/:farm_id', auth(), awaitHandlerFactory( crowdFundController.getFarmCrowdFundWithDrawals ) );

router.post( '/withdrawal/refund', auth(), crowdFundRefundSchema, awaitHandlerFactory( crowdFundController.initiateCrowdFundWithdrawal ) );
module.exports = router;