import AccountModel from '../models/account.model.js';
import FarmerModel from '../models/farmer.model.js';
import HttpException from '../utils/HttpException.utils.js';
import { validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import { responseCode } from '../utils/responseCode.utils.js';
import { sendEmail } from '../services/sendEmail.service.js';
import { generateRandomCode } from '../utils/common.utils.js';
import { generateToken } from '../utils/auth.utils.js';
import { userTypes } from '../utils/userTypes.utils.js';


class AccountController {

    createAccount = async ( req, res, next ) => {
        this.checkValidation( req );

        await this.hashPassword( req );

        const oldAccount = await AccountModel.findOne( { email: req.body.email } );
        if ( oldAccount ) {
            throw new HttpException( responseCode.badRequest, 'This email address has been associated with another account.' );
        }
        req.body.activation_code = generateRandomCode();
        const result = await AccountModel.create( req.body );

        if ( !result ) {
            throw new HttpException( responseCode.internalServerError, 'Something went wrong' );
        }

        const accountDetails = await AccountModel.findOne( { id: result.insertId } );
        const { password, ...dataWithoutPassword } = accountDetails;


        const emailCallback = ( err, data ) => {
            try {
                if ( err ) {
                    res.status( responseCode.internalServerError ).json( {
                        status: responseCode.internalServerError,
                        message: 'Account created but unable to send activation email. Please contact our support center.'
                    } );
                } else {
                    res.status( responseCode.created ).json( {
                        status: responseCode.created,
                        data: dataWithoutPassword,
                        message: 'Account created successfully! Verification code has been sent to your email.'
                    } );
                }
            } catch ( error ) {
                console.log( error );
            }
        }

        const activationEmail = {
            to: accountDetails.email,
            subject: "One more step to go! Activation your account now",
            body: `
                   We are super exited to have you. 
                   Kindly use the code below to activate your account.
                   ${accountDetails.activation_code}
                   `
        }

        sendEmail( activationEmail, emailCallback );
    };

    createFarmerAccount = async ( userId ) => {

        const result = await FarmerModel.create( userId );

        if ( result ) {
            return true;
        } else {
            return false;
        }
    };

    activateAccount = async ( req, res, next ) => {
        this.checkValidation( req );

        let account = await AccountModel.findOne( { email: req.body.email } );

        if ( !account ) {
            throw new HttpException( responseCode.badRequest, 'Unrecognized email address.' );
        }

        if ( account.activation_code !== req.body.activation_code ) {
            throw new HttpException( responseCode.badRequest, 'Invalid activation code.' );
        }

        if ( account.user_type === userTypes.farmer ) {
            const result = FarmerModel.findOne( { user_id: account.id } );
            if ( !result ) { //if account has not been previously activated.
                const farmerAccount = this.createFarmerAccount( account.id );

                if ( !farmerAccount ) {
                    throw new HttpException( responseCode.internalServerError, 'Something went wrong' );
                }
            }

        } else if ( account.user_type === userTypes.investor ) {
            //do something
        }

        const token = generateToken( account.id.toString() );

        const { password, activation_code, ...accountWithoutPassword } = account;

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            data: accountWithoutPassword,
            token,
            message: 'Account verified successfully.'
        } );
    };

    accountLogin = async ( req, res, next ) => {
        this.checkValidation( req );

        const { email, password: pass } = req.body;

        let account = await AccountModel.findOne( { email } );

        if ( !account ) {
            throw new HttpException( responseCode.unauthorized, 'Unrecognized email address.' );
        }


        const isMatch = await bcrypt.compare( pass, account.password );

        if ( !isMatch ) {
            throw new HttpException( responseCode.unauthorized, 'Incorrect password! You can reset your password.' );
        }

        // account matched!
        const token = generateToken( account.id.toString() );

        const { password, ...accountDataWithoutPassword } = account;

        if ( account.user_type === userTypes.farmer ) {
            const farmerAccount = await FarmerModel.findOne( { user_id: account.id } );

            if ( !farmerAccount ) {
                throw new HttpException( responseCode.forbidden, 'Unable to Login. Please activate your account.' );
            } else if ( farmerAccount.status === 'blocked' ) {
                throw new HttpException( responseCode.unauthorized, 'This account has been blocked. Contact support center.' );
            } else if ( farmerAccount.status === 'deleted' ) {
                throw new HttpException( responseCode.unauthorized, 'This account is no longer active.' );
            }

            account = {
                ...account,
                address: farmerAccount.address,
                proof_of_identitty: farmerAccount.proof_of_identitty
            }
        } else if ( account.user_type === userTypes.investor ) {
            //do something
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            data: accountDataWithoutPassword,
            token,
            message: 'Login successful.'
        } );
    };

    checkValidation = ( req ) => {
        const errors = validationResult( req )
        if ( !errors.isEmpty() ) {
            throw new HttpException( responseCode.badRequest, errors.errors[ 0 ].msg || 'One or more required data is not correctly specified.', errors );
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