'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class FarmModeratorModel extends Model {
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
            this.belongsTo( models.Farms, {
                as: 'farm',
                foreignKey: 'farm_id',
                constraints: false
            } );
        }
    };
    FarmModeratorModel.init( {
        status: {
            type: DataTypes.ENUM,
            values: [ 'active', 'blocked', 'deleted' ],
            defaultValue: 'active'
        }
    }, {
        sequelize,
        modelName: 'FarmModerators',
        underscored: true
    } );

    return FarmModeratorModel;
};
