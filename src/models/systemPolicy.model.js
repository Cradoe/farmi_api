'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class SystemPolicyModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate ( models ) {
            // define association here
        }
    };
    SystemPolicyModel.init( {
        crowd_fund_percentage: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: '10'
        },
        investment_maturity_additional_days: {
            type: DataTypes.INTEGER( 20 ),
            allowNull: false,
            defaultValue: 30
        },
        status: {
            type: DataTypes.ENUM,
            values: [ 'active', 'inactive' ],
            defaultValue: 'active'
        }
    }, {
        sequelize,
        modelName: 'SystemPolicies',
        underscored: true
    } );

    return SystemPolicyModel;
};
