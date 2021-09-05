const express = require( "express" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { auth } = require( '../middleware/auth.middleware.js' );
const farmerController = require( "../controllers/farmer.controller.js" );

const router = express.Router();


router.get( '/farms', auth(), awaitHandlerFactory( farmerController.listFarms ) );


module.exports = router;