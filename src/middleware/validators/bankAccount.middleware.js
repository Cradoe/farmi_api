import { body } from 'express-validator';


export const addBankAccountSchema = [
    body( 'account_name' )
        .exists()
        .withMessage( 'Account name is required' )
        .isLength( { min: 3 } )
        .withMessage( 'Account name must be at least 3 characters' ),
    body( 'account_number' )
        .exists()
        .withMessage( 'Account number is required' )
        .isLength( { min: 10, max: 10 } )
        .withMessage( 'Account number must be 10 characters' ),
    body( 'bank_code' )
        .exists()
        .withMessage( 'Bank code is required' )
        .notEmpty()
        .withMessage( 'Bank code must be filled' ),
    body( 'bvn' )
        .exists()
        .withMessage( 'Bvn is required' )
        .notEmpty()
        .withMessage( 'Bvn must be filled' )
];