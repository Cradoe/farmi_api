import HttpException from "../utils/HttpException.utils.js";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const auth = ( ...roles ) => {
    return async function ( req, res, next ) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';
            const JWT_TEST_USER_ID = process.env.JWT_TEST_USER_ID //for swagger UI doc testing


            if ( ( !authHeader || !authHeader.startsWith( bearer ) ) && !JWT_TEST_USER_ID ) {
                throw new HttpException( 401, 'Access denied. No credentials sent!' );
            }

            let token, secretKey, decoded;

            if ( !JWT_TEST_USER_ID ) {
                token = authHeader.replace( bearer, '' );
                secretKey = process.env.SECRET_JWT || "";

                // Verify Token
                decoded = jwt.verify( token, secretKey );
            }
            const user = await UserModel.findOne( { id: decoded ? decoded.user_id : JWT_TEST_USER_ID } );

            if ( !user ) {
                throw new HttpException( 401, 'Authentication failed!' );
            }

            // check if the current user is the owner user
            const ownerAuthorized = req.params.id == user.id;

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if ( !ownerAuthorized && roles.length && !roles.includes( user.role ) ) {
                throw new HttpException( 401, 'Unauthorized' );
            }

            // if the user has permissions
            req.currentUser = user;
            next();

        } catch ( e ) {
            e.status = 401;
            next( e );
        }
    }
}

