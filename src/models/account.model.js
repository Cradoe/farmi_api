import query from '../db/db-connection.js';
import { multipleColumnSet } from '../utils/common.utils.js';
import { userRoles } from '../utils/userRoles.utils.js';
import { userTypes } from '../utils/userTypes.utils.js';

class AccountModel {
    tableName = 'users';

    find = async ( params = {} ) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if ( !Object.keys( params ).length ) {
            return await query( sql );
        }

        const { columnSet, values } = multipleColumnSet( params )
        sql += ` WHERE ${columnSet}`;

        return await query( sql, [ ...values ] );
    }

    findOne = async ( params ) => {
        const { columnSet, values } = multipleColumnSet( params )

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query( sql, [ ...values ] );

        // return back the first row 
        return result[ 0 ];
    }

    create = async ( { firstname, lastname, email, phone, password, gender, user_type, activation_code, profile_picture = 'default_profile_picture.jpg' } ) => {
        const sql = `INSERT INTO ${this.tableName}
        (firstname, lastname, email, phone, password, gender, user_type, profile_picture,activation_code) VALUES (?,?,?,?,?,?,?,?,?)`;

        const result = await query( sql, [ firstname, lastname, email, phone, password, gender, user_type, profile_picture, activation_code ] );

        return result;
    }

    update = async ( params, id ) => {
        const { columnSet, values } = multipleColumnSet( params )

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;

        const result = await query( sql, [ ...values, id ] );

        return result;
    }

    delete = async ( id ) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
        const result = await query( sql, [ id ] );
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

export default new AccountModel;