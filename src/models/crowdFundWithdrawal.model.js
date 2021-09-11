'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class CrowdFundWithdrawalModel extends Model {
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
                foreignKey: 'user_id',
                constraints: false
            } );
            this.belongsTo( models.BankAccounts, {
                as: 'bank',
                foreignKey: 'bank_account_id',
                constraints: false
            } );
        }
    };
    CrowdFundWithdrawalModel.init( {
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
            values: [ 'pending', 'success', 'paid', 'failed' ],
            defaultValue: 'pending'
        }
    }, {
        sequelize,
        modelName: 'CrowdFundWithdrawals',
        underscored: true
    } );

    return CrowdFundWithdrawalModel;
};
