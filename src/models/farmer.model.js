'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class FarmerModel extends Model {
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
    FarmerModel.init( {
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        proof_of_identitty: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM,
            values: [ 'active', 'blocked', 'deleted', 'pending' ]
        }
    }, {
        sequelize,
        modelName: 'Farmers',
        underscored: true
    } );

    return FarmerModel;
};
