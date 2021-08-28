import query from '../db/db-connection.js';
import { multipleColumnSet } from '../utils/common.utils.js';

class FarmModeratorModel {
    tableName = 'farm_moderators';

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

    create = async ( user_id ) => {
        const sql = `INSERT INTO ${this.tableName}
        (user_id) VALUES (?)`;

        const result = await query( sql, [ user_id ] );

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

export default new FarmModeratorModel;