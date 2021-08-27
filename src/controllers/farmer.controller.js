import FarmModel from '../models/farm.model.js';
import HttpException from '../utils/HttpException.utils.js';
import { responseCode } from '../utils/responseCode.utils.js';


class FarmerController {

    listFarms = async ( req, res, next ) => {

        const farms = await FarmModel.find( { farmer_id: req.currentUser.id } );
        if ( !farms ) {
            throw new HttpException( responseCode.notFound, 'You have mot register any farm.' );
        }


        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Farms fetched successfully.',
            data: farms
        } );

    };

}


export default new FarmerController;