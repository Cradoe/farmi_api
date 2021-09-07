'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class InvestmentModel extends Model {
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
            this.belongsTo( models.Users, {
                as: 'account',
                foreignKey: 'investor_id',
                constraints: false
            } );
        }
    };
    InvestmentModel.init( {
        crowd_fund_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        investor_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
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
            values: [ 'active', 'blocked', 'deleted' ],
            defaultValue: 'active'
        }
    }, {
        sequelize,
        modelName: 'Investments',
        underscored: true
    } );

    return InvestmentModel;
};
