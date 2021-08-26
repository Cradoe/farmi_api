import AccountModel from '../models/account.model.js';
import HttpException from '../utils/HttpException.utils.js';
import { validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { responseCode } from '../utils/responseCode.utils.js';
dotenv.config();


class AccountController {

    accountLogin = async ( req, res, next ) => {
        this.checkValidation( req );

        const { email, password: pass } = req.body;

        const account = await AccountModel.findOne( { email } );

        if ( !account ) {
            throw new HttpException( responseCode.unauthorized, 'Unrecognized email address.' );
        }


        const isMatch = await bcrypt.compare( pass, account.password );

        if ( !isMatch ) {
            throw new HttpException( responseCode.unauthorized, 'Incorrect password! You can reset your password.' );
        }

        // account matched!
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign( { account_id: account.id.toString() }, secretKey, {
            expiresIn: '24h'
        } );

        const { password, ...accountWithoutPassword } = account;

        res.send( { ...accountWithoutPassword, token } );
    };

    checkValidation = ( req ) => {
        const errors = validationResult( req )
        if ( !errors.isEmpty() ) {
            throw new HttpException( responseCode.badRequest, 'One or more required data is missing.', errors );
        }
    }

    // hash password if it exists
    hashPassword = async ( req ) => {
        if ( req.body.password ) {
            req.body.password = await bcrypt.hash( req.body.password, 8 );
        }
    }
}


export default new AccountController;