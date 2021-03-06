const HttpException = require( "../utils/HttpException.utils.js" );
const jwt = require( "jsonwebtoken" );
const dotenv = require( "dotenv" );
const { Users: UserModel } = require( '../models/index.js' );

dotenv.config();

exports.auth = ( ...roles ) => {
    return async function ( req, res, next ) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';
            const JWT_TEST_USER_ID = process.env.JWT_TEST_USER_ID //for swagger UI doc testing


            if ( ( !authHeader || !authHeader.startsWith( bearer ) ) && !JWT_TEST_USER_ID ) {
                new HttpException( res, 401, 'Access denied. No credentials sent!' );
                return;
            }

            let token, secretKey, decoded;

            if ( !JWT_TEST_USER_ID ) {
                token = authHeader.replace( bearer, '' );
                secretKey = process.env.SECRET_JWT || "";

                // Verify Token
                decoded = jwt.verify( token, secretKey );
            }
            await UserModel.findByPk( decoded ? decoded.user_id : JWT_TEST_USER_ID ).then( user => {
                if ( user ) {

                    // check if the current user is the owner user
                    const ownerAuthorized = req.params.id == user.id;

                    // if the current user is not the owner and
                    // if the user role don't have the permission to do this action.
                    // the user will get this error
                    if ( !ownerAuthorized && roles.length && !roles.includes( user.role ) ) {
                        new HttpException( res, 401, 'Unauthorized' );
                        return;
                    }
                    // if the user has permissions
                    req.currentUser = user;
                    next();
                } else {
                    new HttpException( res, 401, 'Authentication failed!' );
                    return;
                }
            } );

        } catch ( e ) {
            e.status = 401;
            next( e );
        }
    }
}

