'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class CrowdFundModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate ( models ) {
            // define association here
            this.belongsTo( models.Farms, {
                as: 'Farms',
                foreignKey: 'farm_id',
                constraints: false
            } );
        }
    };
    CrowdFundModel.init( {
        farm_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount_needed: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        investment_deadline: {
            type: DataTypes.DATE,
            allowNull: false
        },
        maturity_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        roi: {
            type: DataTypes.STRING( 20 ),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: [ 'pending', 'active', 'blocked', 'deleted' ],
            defaultValue: 'pending'
        }
    }, {
        sequelize,
        modelName: 'CrowdFunds',
        underscored: true
    } );

    return CrowdFundModel;
};
