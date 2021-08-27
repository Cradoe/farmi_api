import FarmModel from '../models/farm.model.js';
import HttpException from '../utils/HttpException.utils.js';
import { responseCode } from '../utils/responseCode.utils.js';
import { checkValidation } from '../utils/auth.utils.js';


class FarmController {

    createFarm = async ( req, res, next ) => {
        checkValidation( req );
        req.body.farmer_id = req.currentUser.id;

        const result = await FarmModel.findOne( { farm_name: req.body.farm_name } );
        if ( result && Number( result.farmer_id ) === Number( req.body.farmer_id ) ) {
            throw new HttpException( responseCode.badRequest, 'This farm has already been registered by you.' );
        }

        const newFarm = await FarmModel.create( req.body );

        if ( !newFarm ) {
            throw new HttpException( responseCode.internalServerError, 'Something went wrong' );
        }

        const farmDetails = await FarmModel.findOne( { id: newFarm.insertId } );

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Farm registered successfully.',
            data: farmDetails
        } );

    };

    editFarm = async ( req, res, next ) => {
        checkValidation( req );

        const farm = await FarmModel.findOne( { id: req.body.farm_id } );
        if ( !farm ) {
            throw new HttpException( responseCode.notFound, 'No result found.' );
        } else if ( Number( farm.farmer_id ) !== Number( req.currentUser.id ) ) {
            throw new HttpException( responseCode.unauthorized, 'Access Denied. You are not the rightful owner of this farm.' );
        }
        const { farm_id, ...dataToBeUpdated } = req.body;

        const result = await FarmModel.update( dataToBeUpdated, farm_id );

        if ( !result ) {
            throw new HttpException( responseCode.internalServerError, 'Something went wrong. Couldn\'t update record at the moment.' );
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Farm updated successfully.',
            data: { ...farm, ...dataToBeUpdated }
        } );

    };

}


export default new FarmController;