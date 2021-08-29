import { body } from 'express-validator';


export const createAccountSchema = [
    body( 'firstname' )
        .exists()
        .withMessage( 'Your first name is required' )
        .isAlpha()
        .withMessage( 'Must be only alphabetical chars' )
        .isLength( { min: 3 } )
        .withMessage( 'Must be at least 3 chars long' ),
    body( 'lastname' )
        .exists()
        .withMessage( 'Your last name is required' )
        .isAlpha()
        .withMessage( 'Must be only alphabetical chars' )
        .isLength( { min: 3 } )
        .withMessage( 'Must be at least 3 chars long' ),
    body( 'phone' )
        .exists()
        .withMessage( 'Your phone number is required' )
        .notEmpty()
        .withMessage( 'Must be phone number' )
        .isLength( { min: 11 } )
        .withMessage( 'Must be at least 11 chars long' ),
    body( 'email' )
        .exists()
        .withMessage( 'Email is required' )
        .isEmail()
        .withMessage( 'Must be a valid email' )
        .normalizeEmail(),
    body( 'password' )
        .exists()
        .withMessage( 'Password is required' )
        .notEmpty()
        .isStrongPassword()
        .withMessage( "Password is not strong enough." )
        .isLength( { min: 6 } )
        .withMessage( 'Password must contain at least 6 characters' )
        .isLength( { max: 10 } )
        .withMessage( 'Password can contain max 10 characters' ),
    body( 'confirm_password' )
        .exists()
        .custom( ( value, { req } ) => value === req.body.password )
        .withMessage( 'Confirm password field must have the same value as the password field' ),
    body( 'gender' )
        .exists()
        .withMessage( 'Your Gender is required' )
        .notEmpty()
        .withMessage( 'Must be a gender character' )
        .isLength( { max: 1 } )
        .withMessage( 'Must be at most 1 char long' ),
];


export const createFarmModeratorSchema = [
    body( 'farm_id' )
        .exists()
        .withMessage( 'Farm ID is required' )
        .isNumeric()
        .withMessage( 'Farm ID must be only numeric value' ),
    ...createAccountSchema
];

export const activateAccountSchema = [
    body( 'email' )
        .exists()
        .withMessage( 'Email address is required' )
        .isLength( { min: 3 } )
        .withMessage( 'Email address must be at least 3 chars long' ),
    body( 'activation_code' )
        .exists()
        .withMessage( 'Activation code is required' )
        .isLength( { min: 10 } )
        .withMessage( 'Activation code must be at least 10 chars long' ),

];

export const validateLogin = [
    body( 'email' )
        .exists()
        .withMessage( 'Email is required' )
        .isEmail()
        .withMessage( 'Must be a valid email' )
        .normalizeEmail(),
    body( 'password' )
        .exists()
        .withMessage( 'Password is required' )
        .notEmpty()
        .withMessage( 'Password must be filled' )
];

