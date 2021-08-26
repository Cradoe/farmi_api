import UserModel from '../models/user.model.js';
import HttpException from '../utils/HttpException.utils.js';
import { validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { responseCode } from '../utils/responseCode.utils.js';
dotenv.config();

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController {
    getAllUsers = async ( req, res, next ) => {
        let userList = await UserModel.find();
        if ( !userList.length ) {
            throw new HttpException( 404, 'Users not found' );
        }

        userList = userList.map( user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } );

        res.send( userList );
    };

    getUserById = async ( req, res, next ) => {
        const user = await UserModel.findOne( { id: req.params.id } );
        if ( !user ) {
            throw new HttpException( 404, 'User not found' );
        }

        const { password, ...userWithoutPassword } = user;

        res.send( userWithoutPassword );
    };

    getUserByuserName = async ( req, res, next ) => {
        const user = await UserModel.findOne( { username: req.params.username } );
        if ( !user ) {
            throw new HttpException( 404, 'User not found' );
        }

        const { password, ...userWithoutPassword } = user;

        res.send( userWithoutPassword );
    };

    getCurrentUser = async ( req, res, next ) => {
        const { password, ...userWithoutPassword } = req.currentUser;

        res.send( userWithoutPassword );
    };

    createUser = async ( req, res, next ) => {
        this.checkValidation( req );

        await this.hashPassword( req );

        const result = await UserModel.create( req.body );

        if ( !result ) {
            throw new HttpException( 500, 'Something went wrong' );
        }

        res.status( 201 ).json( { message: 'User was created!' } );
    };

    updateUser = async ( req, res, next ) => {
        this.checkValidation( req );

        await this.hashPassword( req );

        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit
        const result = await UserModel.update( restOfUpdates, req.params.id );

        if ( !result ) {
            throw new HttpException( 404, 'Something went wrong' );
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.send( { message, info } );
    };

    deleteUser = async ( req, res, next ) => {
        const result = await UserModel.delete( req.params.id );
        if ( !result ) {
            throw new HttpException( 404, 'User not found' );
        }
        res.send( 'User has been deleted' );
    };

    userLogin = async ( req, res, next ) => {
        this.checkValidation( req );

        const { email, password: pass } = req.body;

        const user = await UserModel.findOne( { email } );

        if ( !user ) {
            throw new HttpException( responseCode.unauthorized, 'Unrecognized email address.' );
        }


        const isMatch = await bcrypt.compare( pass, user.password );

        if ( isMatch ) {
            throw new HttpException( responseCode.unauthorized, 'Incorrect password! You can reset your password.' );
        }

        // user matched!
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign( { user_id: user.id.toString() }, secretKey, {
            expiresIn: '24h'
        } );

        const { password, ...userWithoutPassword } = user;

        res.send( { ...userWithoutPassword, token } );
    };

    checkValidation = ( req ) => {
        const errors = validationResult( req )
        if ( !errors.isEmpty() ) {
            throw new HttpException( responseCode.badRequest, 'One or more required data is missing.', errors );
        }
    }

    // hash password if it exists
    hashPassword = async ( req ) => {
        if ( req.body.password ) {
            req.body.password = await bcrypt.hash( req.body.password, 8 );
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
export default new UserController;