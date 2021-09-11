'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class companyProfitModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate ( models ) {
            // define association here
            this.belongsTo( models.CrowdFundPaybackRemitance, {
                as: 'crowdFundPaybackRemitance',
                foreignKey: 'crowd_fund_payback_remitance_id',
                constraints: false
            } );
            this.belongsTo( models.SystemPolicies, {
                as: 'systemPolicy',
                foreignKey: 'system_policy_id',
                constraints: false
            } );
        }
    };
    companyProfitModel.init( {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: [ 'pending', 'success', 'failed' ],
            defaultValue: 'success'
        }
    }, {
        sequelize,
        modelName: 'CompanyProfit',
        underscored: true
    } );

    return companyProfitModel;
};
