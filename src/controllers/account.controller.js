const HttpException = require( '../utils/HttpException.utils.js' );
const bcrypt = require( "bcrypt" );
const responseCode = require( '../utils/responseCode.utils.js' );
const sendEmail = require( '../services/sendEmail.service.js' );
const { generateRandomCode } = require( '../utils/common.utils.js' );
const { generateToken, checkValidation } = require( '../utils/auth.utils.js' );

const { Users: UserModel, Farmers: FarmerModel, Farms: FarmModel, FarmModerators: FarmModeratorModel, BankAccounts: BankAccountModel } = require( '../models/index.js' );


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
        if ( !userAccount ) return;
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

            await FarmerModel.findOne( { where: { user_id: accountDetails.id } } ).then( async data => {
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

        const farm = await FarmModel.findOne( { where: { id: req.body.farm_id } } );
        if ( !farm || farm.length === 0 ) {
            new HttpException( res, responseCode.internalServerError, 'Unable to access farm.' );
            return;
        } else if ( Number( farm.dataValues.farmer_id ) !== Number( req.currentUser.id ) ) {
            new HttpException( res, responseCode.unauthorized, 'Permission denied. You don\'t have permission to create a moderator for this farm.' );
            return;
        }
        const userAccount = await this.createUserAccount( req, res, next );
        if ( !userAccount ) return;

        const moderatorAccount = await FarmModeratorModel.create( { user_id: userAccount.id, farm_id: req.body.farm_id } );
        if ( !moderatorAccount ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong' );
            return;
        }
        const { password, ...dataWithoutPassword } = userAccount;

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Account created successfully! Moderator can now login with the email and password.',
            data: dataWithoutPassword
        } );
    };


    farmModeratorLogin = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        await this.accountLogin( req, res, async ( accountDetails, token ) => {

            await FarmModeratorModel.findOne( { where: { user_id: accountDetails.id } } ).then( async data => {
                if ( !data ) {
                    new HttpException( res, responseCode.unauthorized, 'Unauthorized access denied! You are not registered as a farmer.' );
                    return;
                } else if ( data.dataValues.status === "pending" ) {
                    new HttpException( res, responseCode.forbidden, 'Unable to Login. Please activate your account.' );
                    return;
                } else if ( data.dataValues.status === 'blocked' ) {
                    new HttpException( res, responseCode.unauthorized, 'This account has been blocked. Contact the real owner of this farm.' );
                    return;
                } else if ( data.dataValues.status === 'deleted' ) {
                    new HttpException( res, responseCode.unauthorized, 'This account is no longer active.' );
                    return;
                } else {
                    const { farm_id } = data.dataValues;
                    accountDetails.farm_id = farm_id;

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

    addBankAccount = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        req.body.user_id = req.currentUser.id;
        const { account_number, user_id } = req.body;
        let accountDetails = await BankAccountModel.findOne( { where: { account_number, user_id } } );

        if ( accountDetails && accountDetails.dataValues.status !== 'deleted' ) {
            new HttpException( res, responseCode.unauthorized, 'This account details has been previously registered by you.' );
            return;
        } else if ( accountDetails && accountDetails.dataValues.status === 'deleted' ) {
            //change status from deleted
            const result = await BankAccountModel.update( { status: 'active' }, { where: { id: accountDetails.dataValues.id } } );
            accountDetails.dataValues.status = 'active';
            if ( result ) {
                res.status( responseCode.created ).json( {
                    status: responseCode.created,
                    message: 'Bank account added succesfully.',
                    data: accountDetails.dataValues
                } );
            }
            else {
                new HttpException( res, responseCode.internalServerError, 'Something went wrong and couln\'t save bank account details. Try again.' );
                return;
            }
        }
        accountDetails = await BankAccountModel.create( req.body );

        if ( accountDetails ) {
            res.status( responseCode.created ).json( {
                status: responseCode.created,
                message: 'Bank account added succesfully.',
                data: accountDetails.dataValues
            } );
        } else {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong and couln\'t save bank account details. Try again.' );
            return;
        }


    };

    deleteBankAccount = async ( req, res, next ) => {

        const account = await BankAccountModel.findByPk( req.params.id );
        if ( !account ) {
            new HttpException( res, responseCode.notFound, 'No account found' );
            return;
        } else if ( Number( account.dataValues.user_id ) !== Number( req.currentUser.id ) ) {
            new HttpException( res, responseCode.unauthorized, 'Permission Denied. You are not the rightful owner of this account.' );
            return;
        }

        const result = await BankAccountModel.update( { status: 'deleted' }, { where: { id: account.dataValues.id } } );

        if ( !result ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Couldn\'t delete record at the moment.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Bank Account deleted successfully.'
        } );

    };


    getUserBankAccounts = async ( req, res, next ) => {

        let bankAccounts = await BankAccountModel.findAll( { where: { user_id: req.currentUser.id, status: 'active' } } );

        if ( !bankAccounts || bankAccounts.length === 0 ) {
            new HttpException( res, responseCode.notFound, 'You have not added any bank account.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Bank fetched succesfully.',
            data: bankAccounts
        } );

    };

    hashPassword = async ( req ) => {
        if ( req.body.password ) {
            req.body.password = await bcrypt.hash( req.body.password, 8 );
        }
    }
}


module.exports = new AccountController;