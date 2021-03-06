const dotenv = require( "dotenv" );
const { accountPaths, accountTag } = require( "../docs/account.doc.js" );
const { bankAccountPaths, bankAccountTag } = require( "../docs/bankAccount.doc.js" );
const { crowdFundTag, crowdFundPaths } = require( "../docs/crowdFund.doc.js" );
const { crowdFundRemitanceTag, crowdFundRemitancePaths } = require( "../docs/crowdFundRemitance.doc.js" );
const { crowdFundWithdrawalTag, crowdFundWithdrawalPaths } = require( "../docs/crowdFundWithdrawal.doc.js" );
const { farmPaths, farmTag } = require( "../docs/farm.doc.js" );
const { farmCategoryTag, farmCategoryPaths } = require( "../docs/farmCategories.doc.js" );
const { farmerPaths, farmerTag } = require( "../docs/farmer.doc.js" );
const { farmGalleryTag, farmGalleryPaths } = require( "../docs/farmGallery.doc.js" );
const { investmentTag, investmentPaths } = require( "../docs/investment.doc.js" );
const { investorTag, investorPaths } = require( "../docs/investor.doc.js" );

dotenv.config();

const swaggerConfig = {
    "openapi": '3.0.0',
    "info": {
        "version": "1.0.0",
        "title": "Farmi API",
        "description": "Farmi API documentation",

    },
    "servers": [
        {
            url: 'http://127.0.0.1:' + process.env.PORT || 3331,
            description: 'Development server',
        },
        {
            url: 'https://farmi-api-center.herokuapp.com',
            description: 'Production server',
        }
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "responses": {
        "NotFound": {
            "description": "Entity not found."
        },
        "IllegalInput": {
            "description": "Illegal input for operation."
        },
        "GeneralError": {
            "description": "General Error"
        }
    },
    "tags": [
        accountTag,
        farmCategoryTag,
        farmTag,
        farmGalleryTag,
        farmerTag,
        bankAccountTag,
        crowdFundTag,
        investmentTag,
        crowdFundWithdrawalTag,
        crowdFundRemitanceTag,
        investorTag
    ],
    "paths": {
        ...accountPaths,
        ...farmCategoryPaths,
        ...farmPaths,
        ...farmGalleryPaths,
        ...farmerPaths,
        ...bankAccountPaths,
        ...crowdFundPaths,
        ...investmentPaths,
        ...crowdFundWithdrawalPaths,
        ...crowdFundRemitancePaths,
        ...investorPaths
    },
}

module.exports = swaggerConfig;