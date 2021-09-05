'use strict';
const {
    Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
    class UserModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate ( models ) {
            // define association here
        }
    };
    UserModel.init( {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profile_picture: {
            type: DataTypes.STRING,
            defaultValue: 'default-image.jpg'
        },
        gender: {
            type: DataTypes.STRING( 1 )
        },
        user_type: {
            type: DataTypes.ENUM,
            values: [ 'farmer', 'investor', 'staff', 'moderator' ]
        },
        activation_code: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Users',
        underscored: true
    } );
    return UserModel;
};
