const express = require( "express" );
const farmController = require( "../controllers/farm.controller.js" );
const { awaitHandlerFactory } = require( '../middleware/awaitHandlerFactory.middleware.js' );
const { createFarmSchema, updateFarmSchema } = require( "../middleware/validators/farmValidator.middleware.js" );
const { auth } = require( '../middleware/auth.middleware.js' );
const uploadFile = require( "../services/uploadFile.service.js" );


const router = express.Router();


router.post( '/create', auth(), uploadFile.single( "logo" ), createFarmSchema, awaitHandlerFactory( farmController.createFarm ) );
router.patch( '/edit/:id', auth(), updateFarmSchema, awaitHandlerFactory( farmController.editFarm ) );
router.delete( '/delete/:id', auth(), awaitHandlerFactory( farmController.deleteFarm ) );

router.delete( '/:farm_id/moderator/delete/:user_id', auth(), awaitHandlerFactory( farmController.deleteFarmModerator ) );


router.post( '/crowd_fund/apply', auth(), updateFarmSchema, awaitHandlerFactory( farmController.editFarm ) );




module.exports = router;