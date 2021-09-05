const HttpException = require( '../utils/HttpException.utils.js' );
const bcrypt = require( "bcrypt" );
const responseCode = require( '../utils/responseCode.utils.js' );
const sendEmail = require( '../services/sendEmail.service.js' );
const { generateRandomCode } = require( '../utils/common.utils.js' );
const { generateToken, checkValidation } = require( '../utils/auth.utils.js' );
const userTypes = require( '../utils/userTypes.utils.js' );

const { Users: UserModel, Farmers: FarmerModel } = require( '../models/index.js' );
// const AccountModel = require( '../models/account.model.js' );
// const FarmerModel = require( '../models/farmer.model.js' );
// const FarmModel = require( '../models/farm.model.js' );
// const FarmModeratorModel = require( '../models/farmModerator.model.js' );
// const BankAccountModel = require( '../models/bankAccount.model.js' );


class AccountController {

    createUserAccount = async ( req, res, fn ) => {

        await this.hashPassword( req );
        await UserModel.findAll( { where: { email: req.body.email } } ).then( async data => {
            if ( data.length > 0 ) {
                new HttpException( res, responseCode.badRequest, 'This email address has been associated with another account. ' );
            } else {
                req.body.activation_code = generateRandomCode();
                await UserModel.create( req.body ).then( data => {
                    if ( data && data.dataValues ) fn( data.dataValues );
                    else new HttpException( res, responseCode.internalServerError, 'Something went wrong' );

                } ).catch( error => {
                    new HttpException( res, responseCode.internalServerError, 'Something went wrong', error )
                } );
            }
        } ).catch( error => {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong', error )
        } );

    };

    createFarmerAccount = async ( req, res, next ) => {
        checkValidation( req );

        const createAccountCallback = async ( userAccount ) => {

            await FarmerModel.create( { user_id: userAccount.id } ).then( async response => {
                if ( response ) {
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
                                    data: 'dataWithoutPassword'
                                } );
                            }
                        } catch ( error ) {
                            console.log( error );
                        }
                    }

                    await this.sendActivationCode( userAccount, emailCallback );
                } else {
                    new HttpException( res, responseCode.internalServerError, 'Something went wrong. Please contact our support center.', error )
                }
            } ).catch( error => {
                new HttpException( res, responseCode.internalServerError, 'Something went wrong. Please contact our support center.', error )
            } );
        }

        await this.createUserAccount( req, res, createAccountCallback );

    };

    // farmerLogin = async ( req, res, next ) => {
    //     checkValidation( req );
    //     let account = await this.accountLogin( req, res, next );
    //     if ( account.user_type !== userTypes.farmer ) {
    //         throw new HttpException( responseCode.unauthorized, 'Access denied! You don\'t have permission to access this page.' );
    //     }


    //     const farmerAccount = await FarmerModel.findOne( { user_id: account.id } );

    //     if ( !farmerAccount ) {
    //         throw new HttpException( responseCode.unauthorized, 'Access denied! You don\'t have permission to access this page.' );
    //     } else if ( farmerAccount.status === "pending" ) {
    //         throw new HttpException( responseCode.forbidden, 'Unable to Login. Please activate your account.' );
    //     } else if ( farmerAccount.status === 'blocked' ) {
    //         throw new HttpException( responseCode.unauthorized, 'This account has been blocked. Contact support center.' );
    //     } else if ( farmerAccount.status === 'deleted' ) {
    //         throw new HttpException( responseCode.unauthorized, 'This account is no longer active.' );
    //     }

    //     account = {
    //         ...account,
    //         address: farmerAccount.address,
    //         proof_of_identitty: farmerAccount.proof_of_identitty
    //     }

    //     const { password, ...accountDataWithoutPassword } = account;

    //     res.status( responseCode.oK ).json( {
    //         status: responseCode.oK,
    //         message: 'Login successful.',
    //         token,
    //         data: accountDataWithoutPassword
    //     } );
    // };

    // createFarmModeratorAccount = async ( req, res, next ) => {
    //     checkValidation( req );


    //     const farm = await FarmModel.findOne( { id: req.body.farm_id } );

    //     if ( !farm || farm === undefined ) {
    //         throw new HttpException( responseCode.internalServerError, 'Unable to access farm.' );
    //     } else if ( Number( farm.farmer_id ) !== Number( req.currentUser.id ) ) {
    //         throw new HttpException( responseCode.unauthorized, 'Permission denied. You don\'t have permission to create a moderator for this farm.' );
    //     }


    //     const userAccount = await this.createUserAccount( req, res, next );

    //     const moderatorAccount = await FarmModeratorModel.create( userAccount.id, req.body.farm_id );

    //     if ( !moderatorAccount ) {
    //         throw new HttpException( responseCode.internalServerError, 'Something went wrong' );
    //     }

    //     res.status( responseCode.created ).json( {
    //         status: responseCode.created,
    //         message: 'Account created successfully! Moderator can now login with the email and password.',
    //         data: userAccount
    //     } );


    // };

    // farmModeratorLogin = async ( req, res, next ) => {
    //     checkValidation( req );
    //     let account = await this.accountLogin( req, res, next );

    //     if ( account.user_type !== userTypes.farmer ) {
    //         throw new HttpException( responseCode.unauthorized, 'Access denied! You don\'t have permission to access this page.' );
    //     }


    //     const farmModeratorAccount = await FarmModeratorModel.findOne( { user_id: account.id } );

    //     if ( !farmModeratorAccount ) {
    //         throw new HttpException( responseCode.unauthorized, 'Access denied! You don\'t have permission to access this page.' );
    //     } else if ( farmModeratorAccount.status === "pending" ) {
    //         throw new HttpException( responseCode.forbidden, 'Unable to Login. Please activate your account.' );
    //     } else if ( farmModeratorAccount.status === 'blocked' ) {
    //         throw new HttpException( responseCode.unauthorized, 'This account has been blocked. Contact the real owner of this farm.' );
    //     } else if ( farmModeratorAccount.status === 'deleted' ) {
    //         throw new HttpException( responseCode.unauthorized, 'This account is no longer active.' );
    //     }

    //     account = {
    //         ...account,
    //         address: farmModeratorAccount.address,
    //         proof_of_identitty: farmModeratorAccount.proof_of_identitty
    //     }

    //     const { password, ...accountDataWithoutPassword } = account;

    //     res.status( responseCode.oK ).json( {
    //         status: responseCode.oK,
    //         message: 'Login successful.',
    //         token,
    //         data: accountDataWithoutPassword
    //     } );
    // };

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
        callback();
        // await sendEmail( activationEmail, callback );
    }

    // activateAccount = async ( req, res, next ) => {
    //     checkValidation( req );

    //     let account = await AccountModel.findOne( { email: req.body.email } );

    //     if ( !account ) {
    //         throw new HttpException( responseCode.badRequest, 'Unrecognized email address.' );
    //     }

    //     if ( account.activation_code !== req.body.activation_code ) {
    //         throw new HttpException( responseCode.badRequest, 'Invalid activation code.' );
    //     }

    //     const token = generateToken( account.id.toString() );

    //     const { password, activation_code, ...accountWithoutPassword } = account;

    //     res.status( responseCode.oK ).json( {
    //         status: responseCode.oK,
    //         message: 'Account verified successfully.',
    //         token,
    //         data: accountWithoutPassword,
    //     } );
    // };

    // accountLogin = async ( req, res, next ) => {
    //     checkValidation( req );

    //     const { email, password: pass } = req.body;

    //     let account = await AccountModel.findOne( { email } );

    //     if ( !account ) {
    //         throw new HttpException( responseCode.unauthorized, 'Unrecognized email address.' );
    //     }


    //     const isMatch = await bcrypt.compare( pass, account.password );

    //     if ( !isMatch ) {
    //         throw new HttpException( responseCode.unauthorized, 'Incorrect password! You can reset your password.' );
    //     }
    //     return account;
    // };

    // addBankAccount = async ( req, res, next ) => {
    //     checkValidation( req );
    //     req.body.user_id = req.currentUser.id;
    //     const { account_number, user_id } = req.body;
    //     let accountDetails = await BankAccountModel.findOne( { account_number, user_id }, ' AND ' );

    //     if ( accountDetails && accountDetails.status !== 'deleted' ) {
    //         throw new HttpException( responseCode.unauthorized, 'This account details has been previously registered by you.' );
    //     } else if ( accountDetails && accountDetails.status === 'deleted' ) {
    //         //change status from deleted
    //         const result = await BankAccountModel.update( { status: 'active' }, accountDetails.id );
    //         accountDetails.status = 'active';
    //         if ( !result ) {
    //             throw new HttpException( responseCode.internalServerError, 'Something went wrong and couln\'t save bank account details. Try again.' );
    //         }
    //     } else {
    //         const bankAccount = await BankAccountModel.create( req.body );

    //         if ( !bankAccount ) {
    //             throw new HttpException( responseCode.internalServerError, 'Something went wrong and couln\'t save bank account details. Try again.' );
    //         }

    //         accountDetails = await BankAccountModel.findOne( { id: bankAccount.insertId } );
    //     }


    //     res.status( responseCode.created ).json( {
    //         status: responseCode.created,
    //         message: 'Bank account added succesfully.',
    //         data: accountDetails
    //     } );
    // };



    // deleteBankAccount = async ( req, res, next ) => {

    //     const account = await BankAccountModel.findOne( { id: req.params.id } );
    //     if ( !account ) {
    //         throw new HttpException( responseCode.notFound, 'No account found' );
    //     } else if ( Number( account.user_id ) !== Number( req.currentUser.id ) ) {
    //         throw new HttpException( responseCode.unauthorized, 'Permission Denied. You are not the rightful owner of this account.' );
    //     }

    //     const result = await BankAccountModel.delete( req.params.id );

    //     if ( !result ) {
    //         throw new HttpException( responseCode.internalServerError, 'Something went wrong. Couldn\'t delete record at the moment.' );
    //     }

    //     res.status( responseCode.oK ).json( {
    //         status: responseCode.oK,
    //         message: 'Bank Account deleted successfully.'
    //     } );

    // };

    hashPassword = async ( req ) => {
        if ( req.body.password ) {
            req.body.password = await bcrypt.hash( req.body.password, 8 );
        }
    }
}


module.exports = new AccountController;