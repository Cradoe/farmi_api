import AccountModel from '../models/account.model.js';
import FarmerModel from '../models/farmer.model.js';
import FarmModel from '../models/farm.model.js';
import FarmModeratorModel from '../models/farmModerator.model.js';
import HttpException from '../utils/HttpException.utils.js';
import bcrypt from "bcrypt";
import { responseCode } from '../utils/responseCode.utils.js';
import { sendEmail } from '../services/sendEmail.service.js';
import { generateRandomCode } from '../utils/common.utils.js';
import { generateToken, checkValidation } from '../utils/auth.utils.js';
import { userTypes } from '../utils/userTypes.utils.js';


class AccountController {

    createUserAccount = async ( req, res, next ) => {

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
        return accountDetails;
    };

    createFarmerAccount = async ( req, res, next ) => {
        checkValidation( req );

        const userAccount = await this.createUserAccount( req, res, next );
        const farmerAccount = await FarmerModel.create( userAccount.id );

        if ( !farmerAccount ) {
            throw new HttpException( responseCode.internalServerError, 'Something went wrong' );
        }

        const { password, ...dataWithoutPassword } = userAccount;

        const emailCallback = ( err ) => {
            try {
                if ( err ) {
                    res.status( responseCode.internalServerError ).json( {
                        status: responseCode.internalServerError,
                        message: 'Account created but unable to send activation email. Please contact our support center.'
                    } );
                } else {
                    res.status( responseCode.created ).json( {
                        status: responseCode.created,
                        message: 'Account created successfully! Verification code has been sent to your email.',
                        data: dataWithoutPassword
                    } );
                }
            } catch ( error ) {
                console.log( error );
            }
        }

        await this.sendActivationCode( userAccount, emailCallback );

    };

    farmerLogin = async ( req, res, next ) => {
        checkValidation( req );
        let account = await this.accountLogin( req, res, next );
        if ( account.user_type !== userTypes.farmer ) {
            throw new HttpException( responseCode.unauthorized, 'Access denied! You don\'t have permission to access this page.' );
        }


        const farmerAccount = await FarmerModel.findOne( { user_id: account.id } );

        if ( !farmerAccount ) {
            throw new HttpException( responseCode.unauthorized, 'Access denied! You don\'t have permission to access this page.' );
        } else if ( farmerAccount.status === "pending" ) {
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

        const { password, ...accountDataWithoutPassword } = account;

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Login successful.',
            token,
            data: accountDataWithoutPassword
        } );
    };

    createFarmModeratorAccount = async ( req, res, next ) => {
        checkValidation( req );


        const farm = await FarmModel.findOne( { id: req.body.farm_id } );

        if ( !farm || farm === undefined ) {
            throw new HttpException( responseCode.internalServerError, 'Unable to access farm.' );
        } else if ( Number( farm.farmer_id ) !== Number( req.currentUser.id ) ) {
            throw new HttpException( responseCode.unauthorized, 'Permission denied. You don\'t have permission to create a moderator for this farm.' );
        }


        const userAccount = await this.createUserAccount( req, res, next );

        const moderatorAccount = await FarmModeratorModel.create( userAccount.id, req.body.farm_id );

        if ( !moderatorAccount ) {
            throw new HttpException( responseCode.internalServerError, 'Something went wrong' );
        }

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Account created successfully! Moderator can now login with the email and password.',
            data: userAccount
        } );


    };

    farmModeratorLogin = async ( req, res, next ) => {
        checkValidation( req );
        let account = await this.accountLogin( req, res, next );

        if ( account.user_type !== userTypes.farmer ) {
            throw new HttpException( responseCode.unauthorized, 'Access denied! You don\'t have permission to access this page.' );
        }


        const farmModeratorAccount = await FarmModeratorModel.findOne( { user_id: account.id } );

        if ( !farmModeratorAccount ) {
            throw new HttpException( responseCode.unauthorized, 'Access denied! You don\'t have permission to access this page.' );
        } else if ( farmModeratorAccount.status === "pending" ) {
            throw new HttpException( responseCode.forbidden, 'Unable to Login. Please activate your account.' );
        } else if ( farmModeratorAccount.status === 'blocked' ) {
            throw new HttpException( responseCode.unauthorized, 'This account has been blocked. Contact the real owner of this farm.' );
        } else if ( farmModeratorAccount.status === 'deleted' ) {
            throw new HttpException( responseCode.unauthorized, 'This account is no longer active.' );
        }

        account = {
            ...account,
            address: farmModeratorAccount.address,
            proof_of_identitty: farmModeratorAccount.proof_of_identitty
        }

        const { password, ...accountDataWithoutPassword } = account;

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Login successful.',
            token,
            data: accountDataWithoutPassword
        } );
    };

    sendActivationCode = async ( { email: to, activation_code }, callback ) => {

        const activationEmail = {
            to,
            subject: "One more step to go! Activation your account now",
            body: `
               We are super exited to have you. 
               Kindly use the code below to activate your account.
               ${activation_code}
               `
        }

        await sendEmail( activationEmail, callback );
    }

    activateAccount = async ( req, res, next ) => {
        checkValidation( req );

        let account = await AccountModel.findOne( { email: req.body.email } );

        if ( !account ) {
            throw new HttpException( responseCode.badRequest, 'Unrecognized email address.' );
        }

        if ( account.activation_code !== req.body.activation_code ) {
            throw new HttpException( responseCode.badRequest, 'Invalid activation code.' );
        }

        const token = generateToken( account.id.toString() );

        const { password, activation_code, ...accountWithoutPassword } = account;

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Account verified successfully.',
            token,
            data: accountWithoutPassword,
        } );
    };

    accountLogin = async ( req, res, next ) => {
        checkValidation( req );

        const { email, password: pass } = req.body;

        let account = await AccountModel.findOne( { email } );

        if ( !account ) {
            throw new HttpException( responseCode.unauthorized, 'Unrecognized email address.' );
        }


        const isMatch = await bcrypt.compare( pass, account.password );

        if ( !isMatch ) {
            throw new HttpException( responseCode.unauthorized, 'Incorrect password! You can reset your password.' );
        }
        return account;
    };

    hashPassword = async ( req ) => {
        if ( req.body.password ) {
            req.body.password = await bcrypt.hash( req.body.password, 8 );
        }
    }
}


export default new AccountController;