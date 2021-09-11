const express = require( "express" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { auth } = require( '../middleware/auth.middleware.js' );
const farmCategoryController = require( "../controllers/farmCategory.controller.js" );
const { createCategorySchema } = require( "../middleware/validators/farmCategory.middleware.js" );

const router = express.Router();


router.get( '/', auth(), awaitHandlerFactory( farmCategoryController.listCategories ) );
router.post( '/create', auth(), createCategorySchema, awaitHandlerFactory( farmCategoryController.createCategory ) );


module.exports = router;