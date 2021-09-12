'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class FarmGalleryModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate ( models ) {
            // define association here
            this.belongsTo( models.Farms, {
                as: 'gallery',
                foreignKey: 'farm_id',
                constraints: false
            } );
        }
    };
    FarmGalleryModel.init( {
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'FarmGallery',
        underscored: true
    } );

    return FarmGalleryModel;
};
