const { body } = require( 'express-validator' );

exports.applyForCrowdFundSchema = [
    body( 'farm_id' )
        .exists()
        .withMessage( 'Farm ID is required' ),
    body( 'amount_needed' )
        .exists()
        .withMessage( 'You need to specify the amount needed.' )
        .isLength( { min: 2 } )
        .withMessage( 'Amount needed must be at least 2 chars long' ),
    body( 'investment_deadline' )
        .exists()
        .withMessage( 'Investment deadline is required' )
        .isDate()
        .withMessage( 'Investment deadline must be a valid date.' ),
    body( 'roi' )
        .exists()
        .withMessage( 'Percentage of ROI is required' ),
    body( 'title' )
        .exists()
        .withMessage( 'Crowd fund title is required.' )
        .isLength( { min: 50 } )
        .withMessage( 'Crowd fund title  must be at least 50 chars long' ),
    body( 'description' )
        .exists()
        .withMessage( 'Crowd fund description is required.' )
        .isLength( { min: 50 } )
        .withMessage( 'Crowd fund description  must be at least 50 chars long' ),
    body( 'maturity_date' )
        .exists()
        .withMessage( 'Maturity date founded is required.' )
        .isDate()
        .withMessage( 'Maturity date founded must be a valid date.' )

];
exports.investInCrowdFundSchema = [
    body( 'crowd_fund_id' )
        .exists()
        .withMessage( 'Crowd fund ID is required' ),
    body( 'amount' )
        .exists()
        .withMessage( 'You need to specify the amount to invest.' )
        .isLength( { min: 2 } )
        .withMessage( 'Amount must be at least 2 chars long' ),
    body( 'txref' )
        .exists()
        .withMessage( 'Transaction reference is required' )
];

exports.withdrawalRequestSchema = [
    body( 'crowd_fund_id' )
        .exists()
        .withMessage( 'Crowd fund ID is required' ),
    body( 'bank_account_id' )
        .exists()
        .withMessage( 'Bank account ID is required' )
];

exports.crowdFundRemitanceSchema = [
    body( 'crowd_fund_id' )
        .exists()
        .withMessage( 'Crowd fund ID is required' ),
    body( 'amount' )
        .exists()
        .withMessage( 'You need to specify the amount to pay.' )
        .isLength( { min: 2 } )
        .withMessage( 'Amount must be at least 2 chars long' ),
    body( 'txref' )
        .exists()
        .withMessage( 'Transaction reference is required' )
];


exports.confirmWithdrawalSchema = [
    body( 'txref' )
        .exists()
        .withMessage( 'Transaction reference is required' )
];