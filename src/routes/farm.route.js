const express = require( "express" );
const farmController = require( "../controllers/farm.controller.js" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { createFarmSchema, updateFarmSchema } = require( "../middleware/validators/farmValidator.middleware.js" );
const { auth } = require( '../middleware/auth.middleware.js' );


const router = express.Router();


router.post( '/', auth(), createFarmSchema, awaitHandlerFactory( farmController.createFarm ) );
router.post( '/create', auth(), createFarmSchema, awaitHandlerFactory( farmController.createFarm ) );
router.patch( '/edit/:id', auth(), updateFarmSchema, awaitHandlerFactory( farmController.editFarm ) );
router.delete( '/delete/:id', auth(), awaitHandlerFactory( farmController.deleteFarm ) );

router.delete( '/moderator/:id', auth(), awaitHandlerFactory( farmController.deleteFarm ) );




module.exports = router;