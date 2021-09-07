
const HttpException = require( '../utils/HttpException.utils.js' );
const responseCode = require( '../utils/responseCode.utils.js' );
const { checkValidation } = require( '../utils/auth.utils.js' );
const { Op } = require( "sequelize" );

const { Farms: FarmModel, CrowdFunds: CrowdFundModel, Investments: InvestmentModel } = require( '../models/index.js' );

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
            include: [
                { model: 'farms', attributes: [ 'farm_id', 'farm_name', 'date_founded', 'description', 'land_size', 'latitude', 'longitude', 'logo' ] }
            ],
            attributes: [ 'amount_needed', 'investment_deadline', 'maturity_date', 'roi', 'description', 'status', 'created_at', 'updated_at' ]
        }, { where: { status: 'active' } } );

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
        const farmCrowdFunds = await CrowdFundModel.findByPk( req.params.crowd_fund_id );
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
            new HttpException( res, responseCode.notFound, 'Cr' );
            return;
        }

        const moderatorAccount = await FarmModeratorModel.findOne( { where: { user_id: req.params.user_id, farm_id: req.params.user_id } } );
        if ( !moderatorAccount ) {
            new HttpException( res, responseCode.notFound, 'No account found' );
            return;
        } else if ( moderatorAccount.dataValues.status === 'deleted' ) {
            new HttpException( res, responseCode.unauthorized, 'This moderator account is no longer valid.' );
            return;
        }

        const result = await FarmModeratorModel.update( { status: 'deleted' }, { where: { id: moderatorAccount.dataValues.id } } );

        if ( !result ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Couldn\'t delete record at the moment.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Moderator Account deleted successfully.'
        } );

    };

    getCrowdFunds = async ( req, res, next ) => {
        const farmCrowdFunds = await CrowdFundModel.findAll( {
            include: [
                { model: 'farms', attributes: [ 'farm_id', 'farm_name', 'date_founded', 'description', 'land_size', 'latitude', 'longitude', 'logo' ] }
            ],
            attributes: [ 'amount_needed', 'investment_deadline', 'maturity_date', 'roi', 'description', 'status', 'created_at', 'updated_at' ]
        }, { where: { status: 'active' } } );

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
    investInCrowdFund = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        const investment = await InvestmentModel.findOne( { where: { payment_txref: req.body.txref } } );
        if ( investment ) {
            new HttpException( res, responseCode.badRequest, 'Cannot save duplicate transactions.' );
            return;
        }
        req.body.investor_id = req.currentUser.id;
        let crowdFund = await InvestmentModel.create( req.body );
        if ( !crowdFund ) {
            new HttpException( res, responseCode.internalServerError, "Something went wrong" );
            return;
        }


        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Your application has been received. It takes about 5 working days for our team to review your applicaton.',
            data: crowdFund.dataValues
        } );

    };
}



module.exports = new CrowdFundController;