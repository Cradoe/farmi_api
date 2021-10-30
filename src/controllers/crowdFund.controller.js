
const HttpException = require( '../utils/HttpException.utils.js' );
const responseCode = require( '../utils/responseCode.utils.js' );
const { checkValidation } = require( '../utils/auth.utils.js' );
const { Op } = require( "sequelize" );

const { Farms: FarmModel, CrowdFunds: CrowdFundModel, Investments: InvestmentModel, Users: UserModel, CrowdFundWithdrawals: CrowdFundWithdrawalModel, CrowdFundPaybackRemitance: CrowdFundPaybackRemitanceModel, SystemPolicies: SystemPolicyModel, CompanyProfit: CompanyProfitModel } = require( '../models/index.js' );
const { generateRandomCode } = require( '../utils/common.utils.js' );
const scheduleJob = require( '../services/scheduleJob.service.js' );

class CrowdFundController {

    applyForCrowdFund = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        const farm = await FarmModel.findByPk( req.body.farm_id );
        if ( !farm ) {
            new HttpException( res, responseCode.notFound, 'The farm does not exist.' );
            return;
        } else if ( farm.dataValues.status === 'deleted' ) {
            new HttpException( res, responseCode.badRequest, 'The farm is currently inactive. You can contact the support centre.' );
            return;
        } else if ( farm.dataValues.farmer_id !== req.currentUser.id ) {
            new HttpException( res, responseCode.badRequest, 'Access Denied. You don\'t have permission to perform the operation.' );
            return;
        }

        let crowdFund = await CrowdFundModel.findOne( { where: { farm_id: req.body.farm_id, description: req.body.description } } );
        if ( crowdFund ) {
            new HttpException( res, responseCode.badRequest, 'Duplicate entry. You have a crowd fund record with the same description.' );
            return;
        }
        crowdFund = await CrowdFundModel.create( req.body );


        if ( !crowdFund ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong' );
            return;
        }

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Your application has been received. It takes about 5 working days for our team to review your applicaton.',
            data: crowdFund.dataValues
        } );

    };

    getAllActiveCrowdFunds = async ( req, res, next ) => {
        const farmCrowdFunds = await CrowdFundModel.findAll( {
            where: { status: 'active' },
            include: [ { model: FarmModel, as: 'farm', where: { status: 'active' } } ]
        } );

        if ( !farmCrowdFunds || farmCrowdFunds.length === 0 ) {
            new HttpException( res, responseCode.notFound, 'There is currently no crowd funds at the moment.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'List of crowdfunds fetched successfully.',
            data: farmCrowdFunds
        } );

    };

    getAllFarmCrowdFunds = async ( req, res, next ) => {
        const farmCrowdFunds = await CrowdFundModel.findAll( { where: { farm_id: req.params.farm_id, status: { [ Op.ne ]: 'deleted' } } } );
        if ( !farmCrowdFunds || farmCrowdFunds.length === 0 ) {
            new HttpException( res, responseCode.notFound, 'You don\'t have crowd funding for this farm.' );
            return;
        }

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'List of crowdfunds fetched successfully.',
            data: farmCrowdFunds
        } );

    };

    getDetailsOfCrowdFund = async ( req, res, next ) => {
        const farmCrowdFunds = await CrowdFundModel.findByPk( req.params.crowd_fund_id, {
            include: [ { model: FarmModel, as: 'farm', where: { status: 'active' } } ]
        } );
        if ( !farmCrowdFunds ) {
            new HttpException( res, responseCode.notFound, 'Unable to retrieve any record.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'List of crowdfunds fetched successfully.',
            data: farmCrowdFunds.dataValues
        } );

    };

    deletePendingCrowdFund = async ( req, res, next ) => {

        let crowdFund = await CrowdFundModel.findByPk( req.params.id );
        if ( !crowdFund ) {
            new HttpException( res, responseCode.notFound, 'No crowd fund found.' );
            return;
        } else if ( crowdFund && crowdFund.dataValues.status !== 'pending' ) {
            new HttpException( res, responseCode.badRequest, 'You cannot delete this crowd fund.' );
            return;
        }
        const farmRecord = await FarmModel.findByPk( crowdFund.dataValues.farm_id );
        if ( !farmRecord ) {
            new HttpException( res, responseCode.badRequest, 'Something went wrong.' );
            return;
        } else if ( farmRecord && farmRecord.dataValues.farmer_id !== req.currentUser.id ) {
            new HttpException( res, responseCode.unauthorized, 'You don\'t have permission to perform this operation.' );
            return;
        }


        const result = await CrowdFundModel.update( { status: 'deleted' }, { where: { id: req.params.id } } );

        if ( !result ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Couldn\'t delete record at the moment.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Crowd Fund deleted successfully.'
        } );

    };

    investInCrowdFund = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        let investment = await InvestmentModel.findOne( { where: { txref: req.body.txref } } );
        if ( investment ) {
            new HttpException( res, responseCode.badRequest, 'Cannot save duplicate transactions.' );
            return;
        }
        req.body.investor_id = req.currentUser.id;

        investment = await InvestmentModel.create( req.body );
        if ( !investment ) {
            new HttpException( res, responseCode.internalServerError, "Something went wrong" );
            return;
        }

        // let's check if amount needed has been raised
        const crowdFund = await CrowdFundModel.findByPk( req.body.crowd_fund_id );
        if ( !crowdFund ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Kindly contact our support centre.' );
            return;
        }

        let amountAvailable = await this._calculateCrowdFundInvestments( req.body.crowd_fund_id );

        if ( !amountAvailable ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Kindly contact our support centre.' );
            return;
        }

        if ( crowdFund.dataValues.amount_needed <= amountAvailable ) {
            this._updateCrowdFundStatus( req.body.crowd_fund_id );
        }

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Good job! Your money is working already.',
            data: investment.dataValues
        } );

    };

    getCrowdFundInvestments = async ( req, res, next ) => {

        const crowdFund = await CrowdFundModel.findByPk( req.params.crowd_fund_id );
        if ( !crowdFund ) {
            new HttpException( res, responseCode.notFound, 'No details found' );
            return;
        }
        const investments = await InvestmentModel.findAll( {
            where: { crowd_fund_id: req.params.crowd_fund_id },
            include: [ { model: UserModel, as: 'account' } ]
        } );
        if ( !investments || investments.length === 0 ) {
            new HttpException( res, responseCode.notFound, 'There is no investment for this crowd fund.' );
            return;
        }

        let amountAvailable = 0;

        investments.forEach( investment => {
            amountAvailable += Number( investment.amount );
        } );

        const amountRemaining = Number( crowdFund.dataValues.amount_needed ) - Number( amountAvailable );

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Crowdfund investments fetched successfully.',
            data: {
                amountNeeded: crowdFund.dataValues.amount_needed,
                amountAvailable,
                amountRemaining,
                investments
            }
        } );

    }

    initiateCrowdFundWithdrawal = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        const crowdFund = await CrowdFundModel.findByPk( req.body.crowd_fund_id );
        if ( !crowdFund ) {
            new HttpException( res, responseCode.notFound, 'Cannot get details of the crowd funds.' );
            return;
        }

        if ( crowdFund.dataValues.status !== 'running' ) {
            new HttpException( res, responseCode.badRequest, 'This crowdfund is not currently active.' );
            return;
        }

        const farm = await FarmModel.findByPk( crowdFund.dataValues.farm_id );
        if ( !farm ) {
            new HttpException( res, responseCode.notFound, 'Cannot get details of the farm.' );
            return;
        } else if ( farm.dataValues.farmer_id !== req.currentUser.id ) {
            new HttpException( res, responseCode.unauthorized, 'Access Denied! You don\'t have permission to inititate this withdrawal.' );
            return;
        } else if ( farm.dataValues.status !== 'active' ) {
            new HttpException( res, responseCode.unauthorized, 'You cannot access this fund, Kindly contact our support centre.' );
            return;
        }


        let withdrawal = await CrowdFundWithdrawalModel.findOne( { where: { crowd_fund_id: req.body.crowd_fund_id } } );

        if ( withdrawal && withdrawal.dataValues.status === 'success' ) {
            new HttpException( res, responseCode.badRequest, 'You have withdrawn this funds.' );
            return;
        } else if ( !withdrawal ) {

            let amountWithdrawable = await this._calculateCrowdFundInvestments( req.body.crowd_fund_id );


            if ( !amountWithdrawable ) {
                new HttpException( res, responseCode.badRequest, 'There is no fund to withdraw.' );
                return;
            }

            const roi = ( Number( crowdFund.dataValues.roi ) / 100 ) * amountWithdrawable;
            let companyPercentage = 0;

            const systemPolicy = await SystemPolicyModel.findOne( { where: { status: 'active' } } );
            if ( !systemPolicy ) {
                companyPercentage = 1;
            }

            companyPercentage = ( Number( systemPolicy.dataValues.crowd_fund_percentage ) / 100 ) * amountWithdrawable;


            const amountToBePaid = amountWithdrawable + roi + companyPercentage;



            const data = {
                crowd_fund_id: req.body.crowd_fund_id,
                user_id: req.currentUser.id,
                txref: generateRandomCode() + ( req.currentUser.id ).toString(),
                bank_account_id: req.body.bank_account_id,
                amount: amountToBePaid
            }
            withdrawal = await CrowdFundWithdrawalModel.create( data );
        }

        if ( !withdrawal ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Kindly contact our support centre.' );
            return;
        }


        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Your withdrawal request is ready.',
            data: withdrawal.dataValues
        } );

    }

    confirmWithdrawal = async ( req, res, next ) => {
        const withdrawal = await CrowdFundWithdrawalModel.findOne( { where: { txref: req.body.txref } } );
        if ( !withdrawal ) {
            new HttpException( res, responseCode.badRequest, 'Invalid transaction reference.' );
            return;
        }

        const withdrawalUpdate = await CrowdFundWithdrawalModel.update( { status: 'success' }, { where: { txref: req.body.txref } } );
        if ( !withdrawalUpdate ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Kindly contact our support centre.' );
            return;
        }
        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Your withdrawal request is ready.',
            data: { ...withdrawal.dataValues, status: 'success' }
        } );
    }

    getFarmCrowdFundWithDrawals = async ( req, res, next ) => {
        const crowdFunds = await CrowdFundWithdrawalModel.findAll( {
            where: { status: 'success' },
            include: [ { model: CrowdFundModel, as: 'crowdFund', where: { farm_id: req.params.farm_id } } ]
        } );

        if ( !crowdFunds ) {
            new HttpException( res, responseCode.notFound, 'No crowdfund withdrawal yet.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Withdrawals retrieved successfully.',
            data: crowdFunds
        } );
    }


    payUpCrowdFundWithdrawal = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        const crowdFund = await CrowdFundModel.findByPk( req.body.crowd_fund_id );
        if ( !crowdFund ) {
            new HttpException( res, responseCode.notFound, 'Cannot get details of the crowd funds.' );
            return;
        }

        const crowdFundWithdrawals = await CrowdFundWithdrawalModel.findOne( { where: { crowd_fund_id: req.body.crowd_fund_id, status: 'success' } } );
        if ( !crowdFundWithdrawals ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Can\'t find this withdrawal details.' );
            return;
        }

        const amountWithdrawn = Number( crowdFundWithdrawals.dataValues.amount );

        const roi = ( Number( crowdFund.dataValues.roi ) / 100 ) * amountWithdrawn;
        let companyPercentage = 0;
        const systemPolicy = await SystemPolicyModel.findOne( { where: { status: 'active' } } );
        if ( !systemPolicy ) {
            companyPercentage = 1;
        }

        companyPercentage = ( Number( systemPolicy.dataValues.crowd_fund_percentage ) / 100 ) * amountWithdrawn;


        const amountToBePaid = amountWithdrawn + roi + companyPercentage;

        if ( amountToBePaid !== Number( req.body.amount ) ) {
            new HttpException( res, responseCode.badRequest, 'You are expected to pay up ' + amountToBePaid );
            return;
        }


        const remitance = await CrowdFundPaybackRemitanceModel.create( req.body );

        if ( !remitance ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Can\'t save remitance details.' );
            return;
        }

        const companyProfit = {
            system_policy_id: systemPolicy.dataValues.id,
            amount: companyPercentage,
            crowd_fund_payback_remitance_id: remitance.dataValues.id
        }

        const addCompanyProfit = await CompanyProfitModel.create( companyProfit );

        //update crowdfund withdrawal status
        let update = await CrowdFundWithdrawalModel.update( { status: 'paid' }, { where: { crowd_fund_id: req.body.crowd_fund_id } } );

        // update crowd funds status
        scheduleJob( CrowdFundModel.update( { status: 'matured' }, { where: { id: req.body.crowd_fund_id } } ) );

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Remitance successful.',
            data: remitance.dataValues
        } );
    }

    _updateCrowdFundStatus = async ( crowd_fund_id ) => {
        const update = await CrowdFundModel.update( { status: 'running' }, { where: { id: crowd_fund_id } } );
        return;
    }

    _calculateCrowdFundInvestments = async ( crowd_fund_id ) => {
        const allInvestments = await InvestmentModel.findAll( { where: { crowd_fund_id } } );
        if ( !allInvestments ) {
            return false;
        }

        let amountAvailable = 0;

        allInvestments.forEach( investment => {
            amountAvailable += Number( investment.amount );
        } );

        return amountAvailable;
    }
}



module.exports = new CrowdFundController;