import util from "util";
import multer from "multer";

const maxSize = 10 * 1024 * 1024;

let storage = multer.diskStorage( {
    destination: ( req, file, callback ) => {
        callback( null, __basedir + "/resources/static/assets/uploads/" );
    },
    filename: ( req, file, callback ) => {
        console.log( file.originalname );
        callback( null, file.originalname );
    },
} );

let uploadFileHandler = multer( {
    storage: storage,
    limits: { fileSize: maxSize },
} ).single( "file" );

export const uploadFile = util.promisify( uploadFileHandler );