const express = require( "express" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { auth } = require( '../middleware/auth.middleware.js' );
const { applyForCrowdFundSchema } = require( "../middleware/validators/crowdFund.middleware.js" );
const crowdFundController = require( "../controllers/crowdFund.controller.js" );

const router = express.Router();

router.post( '/apply', auth(), applyForCrowdFundSchema, awaitHandlerFactory( crowdFundController.applyForCrowdFund ) );
router.get( '/farm/:farm_id', auth(), awaitHandlerFactory( crowdFundController.getAllFarmCrowdFunds ) );



module.exports = router;