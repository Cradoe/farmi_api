'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class BankAccountModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate ( models ) {
            // define association here
            this.belongsTo( models.Users, {
                as: 'account',
                foreignKey: 'user_id',
                constraints: false
            } );
        }
    };
    BankAccountModel.init( {
        account_name: {
            type: DataTypes.STRING( 99 ),
            allowNull: true
        },
        account_number: {
            type: DataTypes.INTEGER( 10 ),
            allowNull: true
        },
        bank_code: {
            type: DataTypes.INTEGER( 3 ),
            allowNull: true
        },
        bvn: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM,
            values: [ 'active', 'blocked', 'deleted' ],
            defaultValue: 'active'
        }
    }, {
        sequelize,
        modelName: 'BankAccounts',
        underscored: true
    } );

    return BankAccountModel;
};
