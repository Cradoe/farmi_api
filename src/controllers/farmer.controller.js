const FarmModel = require( '../models/farm.model.js' );
const HttpException = require( '../utils/HttpException.utils.js' );
const { responseCode } = require( '../utils/responseCode.utils.js' );


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


module.exports = new FarmerController;