const express = require( "express" );
const staticFileController = require( "../controllers/staticFile.controller.js" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );

const router = express.Router();


router.get( '/:name', awaitHandlerFactory( staticFileController.getFile ) );

module.exports = router;