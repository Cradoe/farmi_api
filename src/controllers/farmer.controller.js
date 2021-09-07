const { Farms: FarmModel } = require( '../models/index.js' );
const HttpException = require( '../utils/HttpException.utils.js' );
const responseCode = require( '../utils/responseCode.utils.js' );


class FarmerController {

    listFarms = async ( req, res, next ) => {

        const farms = await FarmModel.findAll( { where: { farmer_id: req.currentUser.id } } );
        if ( !farms || farms.length == 0 ) {
            new HttpException( res, responseCode.notFound, 'You have not register any farm.' );
            return;
        }


        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Farms fetched successfully.',
            data: farms
        } );

    };

}


module.exports = new FarmerController;