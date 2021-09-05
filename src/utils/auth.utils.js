
const jwt = require( "jsonwebtoken" );
const dotenv = require( "dotenv" );

const { validationResult } = require( 'express-validator' );
const HttpException = require( './HttpException.utils.js' );
const responseCode = require( "./responseCode.utils.js" );

dotenv.config();

exports.generateToken = ( accountId ) => {
    const secretKey = process.env.SECRET_JWT || "";
    const token = jwt.sign( { account_id: accountId }, secretKey, {
        expiresIn: '24h'
    } );

    return token;
}

exports.checkValidation = ( req ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        throw new HttpException( responseCode.badRequest, errors.errors[ 0 ].msg || 'One or more required data is not correctly specified.', errors );
    }
}
