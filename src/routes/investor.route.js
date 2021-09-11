const express = require( "express" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { auth } = require( '../middleware/auth.middleware.js' );
const investorController = require( "../controllers/investor.controller.js" );

const router = express.Router();


router.get( '/investments', auth(), awaitHandlerFactory( investorController.getInvestments ) );


module.exports = router;