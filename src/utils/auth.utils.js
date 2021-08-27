
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { validationResult } from 'express-validator';
import HttpException from './HttpException.utils.js';
import { responseCode } from "./responseCode.utils.js";

dotenv.config();

export const generateToken = ( accountId ) => {
    const secretKey = process.env.SECRET_JWT || "";
    const token = jwt.sign( { account_id: accountId }, secretKey, {
        expiresIn: '24h'
    } );

    return token;
}

export const checkValidation = ( req ) => {
    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        throw new HttpException( responseCode.badRequest, errors.errors[ 0 ].msg || 'One or more required data is not correctly specified.', errors );
    }
}
