const { body } = require( 'express-validator' );

exports.createFarmSchema = [
    body( 'farm_category_id' )
        .exists()
        .withMessage( 'Farm category is required' ),
    body( 'farm_name' )
        .exists()
        .withMessage( 'Farm name is required.' )
        .isLength( { min: 3 } )
        .withMessage( 'Must be at least 3 chars long' ),
    body( 'latitude' )
        .exists()
        .withMessage( 'Latitude is required' )
        .isNumeric()
        .withMessage( 'Must be only numberic chars' ),
    body( 'longitude' )
        .exists()
        .withMessage( 'Longitude is required' )
        .isNumeric()
        .withMessage( 'Must be only numberic chars' ),
    body( 'description' )
        .exists()
        .withMessage( 'Farm description is required.' )
        .isLength( { min: 50 } )
        .withMessage( 'Description must be at least 50 chars long' ),
    body( 'date_founded' )
        .exists()
        .withMessage( 'Date founded is required.' )
        .isDate()
        .withMessage( 'Date founded must be a valid date.' ),
    body( 'land_size' )
        .exists()
        .withMessage( 'The size of the farm land is required.' )

];

exports.updateFarmSchema = [
    body( 'farm_name' )
        .exists()
        .withMessage( 'Farm name is required.' )
        .isLength( { min: 3 } )
        .withMessage( 'Must be at least 3 chars long' ),
    body( 'latitude' )
        .exists()
        .withMessage( 'Latitude is required' )
        .isNumeric()
        .withMessage( 'Must be only numberic chars' ),
    body( 'longitude' )
        .exists()
        .withMessage( 'Longitude is required' )
        .isNumeric()
        .withMessage( 'Must be only numberic chars' ),
    body( 'description' )
        .exists()
        .withMessage( 'Farm description is required.' )
        .isLength( { min: 50 } )
        .withMessage( 'Description must be at least 50 chars long' ),
    body( 'land_size' )
        .exists()
        .withMessage( 'The size of the farm land is required.' )

];
