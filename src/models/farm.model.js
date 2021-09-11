'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class FarmModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate ( models ) {
            // define association here
            this.belongsTo( models.Farmers, {
                as: 'farmer',
                foreignKey: 'farmer_id',
                constraints: false
            } );

            this.belongsTo( models.FarmCategories, {
                as: 'category',
                foreignKey: 'farm_category_id',
                constraints: false
            } );
        }
    };
    FarmModel.init( {
        farm_name: {
            type: DataTypes.STRING( 99 ),
            allowNull: false
        },
        latitude: {
            type: DataTypes.STRING( 20 ),
            allowNull: false
        },
        longitude: {
            type: DataTypes.STRING( 20 ),
            allowNull: false
        },
        logo: {
            type: DataTypes.STRING( 20 ),
            defaultValue: 'default-logo.jpg'
        },
        date_founded: {
            type: DataTypes.DATE,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        land_size: {
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
        modelName: 'Farms',
        underscored: true
    } );

    return FarmModel;
};
