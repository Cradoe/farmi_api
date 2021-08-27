import query from '../db/db-connection.js';
import { multipleColumnSet } from '../utils/common.utils.js';

class FarmModel {
    tableName = 'farms';

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

    create = async ( data ) => {
        const { farmer_id, farm_category_id, farm_name, latitude, longitude, description, date_founded, land_size } = data;
        const sql = `INSERT INTO ${this.tableName}
        (farmer_id, farm_category_id, farm_name, latitude, longitude, description, date_founded, land_size) VALUES (?,?,?,?,?,?,?,?)`;

        const result = await query( sql, [ farmer_id, farm_category_id, farm_name, latitude, longitude, description, date_founded, land_size ] );

        return result;
    }

    update = async ( params, id ) => {
        const { farm_name, latitude, longitude, description, land_size } = params;
        const { columnSet, values } = multipleColumnSet( { farm_name, latitude, longitude, description, land_size } )

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

export default new FarmModel;