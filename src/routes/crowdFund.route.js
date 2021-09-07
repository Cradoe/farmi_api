const express = require( "express" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { auth } = require( '../middleware/auth.middleware.js' );
const { applyForCrowdFundSchema, investInCrowdFundSchema } = require( "../middleware/validators/crowdFund.middleware.js" );
const crowdFundController = require( "../controllers/crowdFund.controller.js" );

const router = express.Router();

router.get( '/', auth(), awaitHandlerFactory( crowdFundController.getAllActiveCrowdFunds ) );
router.post( '/apply', auth(), applyForCrowdFundSchema, awaitHandlerFactory( crowdFundController.applyForCrowdFund ) );
router.get( '/details/:crowd_fund_id', auth(), awaitHandlerFactory( crowdFundController.getDetailsOfCrowdFund ) );
router.get( '/farm/:farm_id', auth(), awaitHandlerFactory( crowdFundController.getAllFarmCrowdFunds ) );

router.delete( '/:id', auth(), awaitHandlerFactory( crowdFundController.deletePendingCrowdFund ) );


router.post( '/invest', auth(), investInCrowdFundSchema, awaitHandlerFactory( crowdFundController.investInCrowdFund ) );
router.get( '/investments/:crowd_fund_id', auth(), awaitHandlerFactory( crowdFundController.getCrowdFundInvestments ) );

module.exports = router;