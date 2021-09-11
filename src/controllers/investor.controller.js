const { Farms: FarmModel } = require( '../models/index.js' );
const HttpException = require( '../utils/HttpException.utils.js' );
const responseCode = require( '../utils/responseCode.utils.js' );
const { CrowdFunds: CrowdFundModel, Investments: InvestmentModel, InvestmentWithdrawals: InvestmentWithdrawalModel } = require( '../models/index.js' );
const { generateRandomCode } = require( '../utils/common.utils.js' );

const { checkValidation } = require( '../utils/auth.utils.js' );

class InvestorController {
    getInvestments = async ( req, res, next ) => {
        const investments = await InvestmentModel.findAll( {
            where: { investor_id: req.currentUser.id },
            include: [ { model: CrowdFundModel, as: 'crowdFund' } ]
        } );


        if ( !investments || investments.length === 0 ) {
            new HttpException( res, responseCode.notFound, 'You have not invested yet.' );
            return;
        }

        let totalInvestments = 0;

        investments.forEach( investment => {
            totalInvestments += Number( investment.amount );
        } );

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Crowdfund investments fetched successfully',
            data: {
                totalInvestments,
                investments
            }
        } );

    }

    initiateWithdrawal = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        const crowdFund = await CrowdFundModel.findByPk( req.body.crowd_fund_id );
        if ( !crowdFund ) {
            new HttpException( res, responseCode.notFound, 'Cannot get details of the crowd funds.' );
            return;
        }

        if ( crowdFund.dataValues.status !== 'matured' ) {
            new HttpException( res, responseCode.badRequest, 'This crowdfund  has not yet matured' );
            return;
        }

        const investment = await InvestmentModel.findOne( { where: { investor_id: req.currentUser.id, crowd_fund_id: crowdFund.dataValues.id } } );
        if ( !investment ) {
            new HttpException( res, responseCode.notFound, 'You do not have any investment in this crowd fund.' );
            return;
        }


        let withdrawal = await InvestmentWithdrawalModel.findOne( { where: { investment_id: investment.dataValues.id } } );

        if ( withdrawal && withdrawal.dataValues.status === 'success' ) {
            new HttpException( res, responseCode.badRequest, 'You have withdrawn this funds.' );
            return;
        } else if ( !withdrawal ) {

            let amountInvested = investment.dataValues.amount;

            let roi = ( crowdFund.dataValues.roi / 100 ) * amountInvested;

            let amountWithdrawable = roi + amountInvested;

            const data = {
                investment_id: investment.dataValues.id,
                user_id: req.currentUser.id,
                txref: generateRandomCode() + ( req.currentUser.id ).toString(),
                bank_account_id: req.body.bank_account_id,
                amount: amountWithdrawable
            }
            withdrawal = await InvestmentWithdrawalModel.create( data );
        }

        if ( !withdrawal ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Kindly contact our support center.' );
            return;
        }


        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Your withdrawal request is ready.',
            data: withdrawal.dataValues
        } );

    }

    confirmWithdrawal = async ( req, res, next ) => {
        const withdrawal = await InvestmentWithdrawalModel.findOne( { where: { txref: req.body.txref } } );
        if ( !withdrawal ) {
            new HttpException( res, responseCode.badRequest, 'Invalid transaction reference.' );
            return;
        }

        const withdrawalUpdate = await InvestmentWithdrawalModel.update( { status: 'success' }, { where: { txref: req.body.txref } } );
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
}


module.exports = new InvestorController;