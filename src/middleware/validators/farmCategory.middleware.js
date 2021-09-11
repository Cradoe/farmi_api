const { body } = require( 'express-validator' );

exports.createCategorySchema = [
    body( 'category' )
        .exists()
        .withMessage( 'Category name is required' )

];