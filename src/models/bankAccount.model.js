import query from '../db/db-connection.js';
import { multipleColumnSet } from '../utils/common.utils.js';
import { userRoles } from '../utils/userRoles.utils.js';

class BankAccountModel {
    tableName = 'bank_accounts';

    find = async ( params = {} ) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if ( !Object.keys( params ).length ) {
            return await query( sql );
        }

        const { columnSet, values } = multipleColumnSet( params )
        sql += ` WHERE ${columnSet}`;

        return await query( sql, [ ...values ] );
    }

    findOne = async ( params, condition = ', ' ) => {
        const { columnSet, values } = multipleColumnSet( params, condition )
        const sql = `SELECT * FROM ${this.tableName}
        WHERE  ${columnSet}`;
        const result = await query( sql, [ ...values ] );

        // return back the first row 
        return result[ 0 ];
    }

    create = async ( { user_id, account_name, account_number, bank_code, bvn } ) => {
        const sql = `INSERT INTO ${this.tableName}
        ( user_id, account_name, account_number, bank_code, bvn) VALUES (?,?,?,?,?)`;

        const result = await query( sql, [ user_id, account_name, account_number, bank_code, bvn ] );
        return result;
    }

    update = async ( params, id ) => {
        const { columnSet, values } = multipleColumnSet( params )

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;

        const result = await query( sql, [ ...values, id ] );

        return result;
    }

    delete = async ( id ) => { //must not delete bank account from DB
        const sql = `UPDATE ${this.tableName} SET status=? WHERE id = ?`;
        const result = await query( sql, [ 'deleted', id ] );

        return result;
    }
}

export default new BankAccountModel;