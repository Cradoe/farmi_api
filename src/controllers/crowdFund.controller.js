
const HttpException = require( '../utils/HttpException.utils.js' );
const responseCode = require( '../utils/responseCode.utils.js' );
const { checkValidation } = require( '../utils/auth.utils.js' );
const { Op } = require( "sequelize" );

const { Farms: FarmModel, CrowdFunds: CrowdFundModel, Investments: InvestmentModel, Users: UserModel } = require( '../models/index.js' );

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

        res.status( responseCode.created ).json( {
            status: responseCode.created,
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

        res.status( responseCode.created ).json( {
            status: responseCode.created,
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
        const allInvestments = await InvestmentModel.findAll( { where: { crowd_fund_id: req.body.crowd_fund_id } } );
        if ( !allInvestments ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Kindly contact our support centre.' );
            return;
        }

        let amountAvailable = 0;

        allInvestments.forEach( investment => {
            amountAvailable += Number( investment.amount );
        } );

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
            message: 'Crowdfund investments fetched successfully. fetched successfully.',
            data: {
                amountNeeded: crowdFund.dataValues.amount_needed,
                amountAvailable,
                amountRemaining,
                investments
            }
        } );

    };

    _updateCrowdFundStatus = async ( crowd_fund_id ) => {
        const update = await CrowdFundModel.update( { status: 'running' }, { where: { id: crowd_fund_id } } );
        return;
    }
}



module.exports = new CrowdFundController;