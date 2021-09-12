const responseCode = require( '../utils/responseCode.utils.js' );

class StaticFileController {
    getFile = ( req, res ) => {
        const fileName = req.params.name;
        const directoryPath = __basedir + "/resources/static/assets/uploads/";

        res.sendFile( directoryPath + fileName, fileName, ( err ) => {
            if ( err ) {
                res.status( responseCode.internalServerError ).send( {
                    message: "Could not download the file. " + err,
                } );
            }
        } );
    };

}


module.exports = new StaticFileController;