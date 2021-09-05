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

    createUserAccount = async ( req, res ) => {

        await this.hashPassword( req );
        const user = await UserModel.findOne( { where: { email: req.body.email } } );
        if ( user ) {
            new HttpException( res, responseCode.badRequest, 'This email address has been associated with another account. ' );
            return;
        }
        req.body.activation_code = generateRandomCode();

        const newUser = await UserModel.create( req.body );
        if ( !newUser ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong' );
            return;
        }

        return newUser.dataValues;


    };

    createFarmerAccount = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        const userAccount = await this.createUserAccount( req, res );

        const farmerAccount = await FarmerModel.create( { user_id: userAccount.id } );
        const { password, ...dataWithoutPassword } = userAccount;

        if ( farmerAccount ) {
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
        } else {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Please contact our support center.' );
            return;
        }


    };
    farmerLogin = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        await this.accountLogin( req, res, async ( accountDetails, token ) => {

            await FarmerModel.findOne( { where: { id: accountDetails.id } } ).then( async data => {
                if ( !data ) {
                    new HttpException( res, responseCode.unauthorized, 'Unauthorized access denied! You are not registered as a farmer.' );
                } else {
                    const { address, proof_of_identitty } = data.dataValues;
                    accountDetails.address = address;
                    accountDetails.proof_of_identitty = proof_of_identitty;

                    res.status( responseCode.oK ).json( {
                        status: responseCode.oK,
                        message: 'Login successful.',
                        token,
                        data: accountDetails
                    } );


                }
            } ).catch( error => {
                new HttpException( res, responseCode.internalServerError, 'Something went wrong', error )
            } );


        } )
    };

    createFarmModeratorAccount = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        const farm = await FarmerModel.findByPk();
        console.log( farm.dataValues );
        res.send( "Good" );
        // const createAccountCallback = async ( userAccount ) => {

        //     await FarmerModel.create( { user_id: userAccount.id } ).then( async response => {
        //         if ( response ) {
        //             const emailCallback = ( err ) => {
        //                 try {
        //                     if ( err ) {
        //                         res.status( responseCode.internalServerError ).json( {
        //                             status: responseCode.internalServerError,
        //                             message: 'Account created but unable to send activation email. Please contact our support center.'
        //                         } );
        //                     } else {
        //                         res.status( responseCode.created ).json( {
        //                             status: responseCode.created,
        //                             message: 'Account created successfully! Verification code has been sent to your email.',
        //                             data: 'dataWithoutPassword'
        //                         } );
        //                     }
        //                 } catch ( error ) {
        //                     console.log( error );
        //                 }
        //             }

        //             await this.sendActivationCode( userAccount, emailCallback );
        //         } else {
        //             new HttpException( res, responseCode.internalServerError, 'Something went wrong. Please contact our support center.', error )
        //         }
        //     } ).catch( error => {
        //         new HttpException( res, responseCode.internalServerError, 'Something went wrong. Please contact our support center.', error )
        //     } );
        // }

        // await this.createUserAccount( req, res, createAccountCallback );

    };


    // createFarmModeratorAccount = async ( req, res, next ) => {
    //     checkValidation( req,res );


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
    //     checkValidation( req,res );
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

        await sendEmail( activationEmail, callback );
    }

    activateAccount = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        let account = await UserModel.findOne( { where: { email: req.body.email } } );

        if ( !account ) {
            new HttpException( res, responseCode.badRequest, 'Unrecognized email address.' );
            return;
        }
        const { dataValues: accountDetails } = account;

        if ( accountDetails.activation_code !== req.body.activation_code ) {
            new HttpException( res, responseCode.badRequest, 'Invalid activation code.' );
            return;
        }

        const token = generateToken( accountDetails.id.toString() );

        const { password, activation_code, ...accountWithoutPassword } = accountDetails;

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Account verified successfully.',
            token,
            data: accountWithoutPassword,
        } );
    };

    accountLogin = async ( req, res, callback ) => {
        checkValidation( req, res );
        const { email, password: pass } = req.body;

        await UserModel.findOne( { where: { email } } ).then( async data => {
            if ( !data ) {
                new HttpException( res, responseCode.unauthorized, 'Unrecognized email address.' );
                return;
            } else {
                const { dataValues: account } = data;
                const isMatch = await bcrypt.compare( pass, account.password );

                if ( !isMatch ) {
                    new HttpException( res, responseCode.unauthorized, 'Incorrect password! You can reset your password.' );
                    return;
                }
                const { password, ...accountDataWithoutPassword } = account;

                const token = generateToken( account.id.toString() );
                callback( accountDataWithoutPassword, token );

            }
        } ).catch( error => {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong', error );
            return;
        } );
    };

    // addBankAccount = async ( req, res, next ) => {
    //     checkValidation( req,res );
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