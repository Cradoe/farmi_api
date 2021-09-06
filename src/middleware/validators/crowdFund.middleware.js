const { body } = require( 'express-validator' );

exports.applyForCrowdFundSchema = [
    body( 'farm_id' )
        .exists()
        .withMessage( 'Farm ID is required' ),
    body( 'amount_needed' )
        .exists()
        .withMessage( 'You need to specify the amount needed.' )
        .isLength( { min: 2 } )
        .withMessage( 'Must be at least 2 chars long' ),
    body( 'investment_deadline' )
        .exists()
        .withMessage( 'Investment deadline is required' )
        .isDate()
        .withMessage( 'Investment deadline must be a valid date.' ),
    body( 'roi' )
        .exists()
        .withMessage( 'Percentage of ROI is required' ),
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
