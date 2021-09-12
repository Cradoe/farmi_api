const multer = require( 'multer' );

var storage = multer.diskStorage( {
    destination: function ( req, file, cb ) {
        cb( null, __basedir + '/resources/static/assets/uploads/' )
    },
    filename: function ( req, file, cb ) {
        cb( null, Date.now() + "-" + file.originalname );
    }
} );

var uploadFile = multer( { storage: storage } );

module.exports = uploadFile