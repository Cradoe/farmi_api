'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class InvestmentWithdrawalModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate ( models ) {
            // define association here
            this.belongsTo( models.Investments, {
                as: 'investment',
                foreignKey: 'investment_id',
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
    InvestmentWithdrawalModel.init( {
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
        modelName: 'InvestmentWithdrawals',
        underscored: true
    } );

    return InvestmentWithdrawalModel;
};
