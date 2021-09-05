
const HttpException = require( '../utils/HttpException.utils.js' );
const responseCode = require( '../utils/responseCode.utils.js' );
const { checkValidation } = require( '../utils/auth.utils.js' );

const { Farms: FarmModel } = require( '../models/index.js' );

class FarmController {

    createFarm = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        req.body.farmer_id = req.currentUser.id;
        const result = await FarmModel.findOne( { where: { farm_name: req.body.farm_name } } );

        if ( result && Number( result.dataValues.farmer_id ) === Number( req.body.farmer_id ) ) {
            new HttpException( res, responseCode.badRequest, 'This farm has already been registered by you.' );
            return;
        }

        const newFarm = await FarmModel.create( req.body );
        if ( !newFarm ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong' );
            return;
        }

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Farm registered successfully.',
            data: newFarm.dataValues
        } );

    };

    editFarm = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        const farm = await FarmModel.findOne( { where: { id: req.params.id } } );
        if ( !farm ) {
            new HttpException( res, responseCode.notFound, 'No result found.' );
            return;
        } else if ( Number( farm.dataValues.farmer_id ) !== Number( req.currentUser.id ) ) {
            new HttpException( res, responseCode.unauthorized, 'Access Denied. You are not the rightful owner of this farm.' );
            return;
        }

        const result = await FarmModel.update( { ...req.body }, { where: { id: req.params.id } } );
        if ( !result ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Couldn\'t update record at the moment.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Farm updated successfully.',
            data: { ...farm.dataValues, ...req.body }
        } );

    };

    deleteFarm = async ( req, res, next ) => {

        const farm = await FarmModel.findOne( { where: { id: req.params.id } } );
        if ( !farm ) {
            new HttpException( res, responseCode.notFound, 'No result found.' );
            return;
        } else if ( Number( farm.dataValues.farmer_id ) !== Number( req.currentUser.id ) ) {
            new HttpException( res, responseCode.unauthorized, 'Permission Denied. You are not the rightful owner of this farm.' );
            return;
        }

        const result = await FarmModel.destroy( { where: { id: req.params.id } } );
        if ( !result ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Couldn\'t delete record at the moment.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Farm deleted successfully.'
        } );

    };

}


module.exports = new FarmController;