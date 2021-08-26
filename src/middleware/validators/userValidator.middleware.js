import { body } from 'express-validator';
import { userRoles } from '../../utils/userRoles.utils.js';


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
        .isLength( { min: 6 } )
        .withMessage( 'Password must contain at least 6 characters' )
        .isLength( { max: 10 } )
        .withMessage( 'Password can contain max 10 characters' ),
    body( 'confirm_password' )
        .exists()
        .custom( ( value, { req } ) => value === req.body.password )
        .withMessage( 'confirm_password field must have the same value as the password field' ),
    body( 'gender' )
        .exists()
        .withMessage( 'Your Gender is required' )
        .notEmpty()
        .withMessage( 'Must be a gender character' )
        .isLength( { max: 1 } )
        .withMessage( 'Must be at most 1 char long' ),
];

export const updateUserSchema = [
    body( 'username' )
        .optional()
        .isLength( { min: 3 } )
        .withMessage( 'Must be at least 3 chars long' ),
    body( 'first_name' )
        .optional()
        .isAlpha()
        .withMessage( 'Must be only alphabetical chars' )
        .isLength( { min: 3 } )
        .withMessage( 'Must be at least 3 chars long' ),
    body( 'last_name' )
        .optional()
        .isAlpha()
        .withMessage( 'Must be only alphabetical chars' )
        .isLength( { min: 3 } )
        .withMessage( 'Must be at least 3 chars long' ),
    body( 'email' )
        .optional()
        .isEmail()
        .withMessage( 'Must be a valid email' )
        .normalizeEmail(),
    body( 'role' )
        .optional()
        .isIn( [ userRoles.Admin, userRoles.SuperUser ] )
        .withMessage( 'Invalid Role type' ),
    body( 'password' )
        .optional()
        .notEmpty()
        .isLength( { min: 6 } )
        .withMessage( 'Password must contain at least 6 characters' )
        .isLength( { max: 10 } )
        .withMessage( 'Password can contain max 10 characters' )
        .custom( ( value, { req } ) => !!req.body.confirm_password )
        .withMessage( 'Please confirm your password' ),
    body( 'confirm_password' )
        .optional()
        .custom( ( value, { req } ) => value === req.body.password )
        .withMessage( 'confirm_password field must have the same value as the password field' ),
    body( 'age' )
        .optional()
        .isNumeric()
        .withMessage( 'Must be a number' ),
    body()
        .custom( value => {
            return !!Object.keys( value ).length;
        } )
        .withMessage( 'Please provide required field to update' )
        .custom( value => {
            const updates = Object.keys( value );
            const allowUpdates = [ 'username', 'password', 'confirm_password', 'email', 'role', 'first_name', 'last_name', 'age' ];
            return updates.every( update => allowUpdates.includes( update ) );
        } )
        .withMessage( 'Invalid updates!' )
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