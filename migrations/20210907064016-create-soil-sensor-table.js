'use strict';

module.exports = {
  up: async ( queryInterface, Sequelize ) => {
    await queryInterface.createTable( 'soil_sensors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      moisturelvl: {
        type: Sequelize.STRING( 10 ),
        allowNull: false
      },
      temperature: {
        type: Sequelize.STRING( 10 ),
        allowNull: false
      },
      humidity: {
        type: Sequelize.STRING( 10 ),
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    } );
  },

  down: async ( queryInterface, Sequelize ) => {
    await queryInterface.dropTable( 'soil_sensors' );
  }
};
