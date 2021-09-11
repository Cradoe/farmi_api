'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class FarmCategoryModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate ( models ) {
            // define association here
        }
    };
    FarmCategoryModel.init( {
        category: {
            type: DataTypes.STRING( 50 ),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'FarmCategories',
        underscored: true
    } );

    return FarmCategoryModel;
};
