const { Farms: FarmModel } = require( '../models/index.js' );
const HttpException = require( '../utils/HttpException.utils.js' );
const responseCode = require( '../utils/responseCode.utils.js' );
const { CrowdFunds: CrowdFundModel, Investments: InvestmentModel } = require( '../models/index.js' );


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

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Crowdfund investments fetched successfully',
            data: {
                totalInvestments,
                investments
            }
        } );

    };
}


module.exports = new InvestorController;