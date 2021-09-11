'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class crowdFundPaybackRemitanceModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate ( models ) {
            // define association here
            this.belongsTo( models.CrowdFunds, {
                as: 'crowdFund',
                foreignKey: 'crowd_fund_id',
                constraints: false
            } );
        }
    };
    crowdFundPaybackRemitanceModel.init( {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        txref: {
            type: DataTypes.STRING( 20 ),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: [ 'pending', 'success', 'failed' ],
            defaultValue: 'success'
        }
    }, {
        sequelize,
        modelName: 'CrowdFundPaybackRemitance',
        underscored: true
    } );

    return crowdFundPaybackRemitanceModel;
};
