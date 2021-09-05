'use strict';

module.exports = {
  up: async ( queryInterface, Sequelize ) => {
    await queryInterface.createTable( 'Farms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      farmer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'farmers'
          },
          key: 'id'
        },
        allowNull: false
      },

      farm_category_id: {
        type: Sequelize.INTEGER( 3 ),
        allowNull: true
      },
      farm_name: {
        type: Sequelize.STRING( 99 ),
        allowNull: true
      },
      latitude: {
        type: Sequelize.STRING( 20 ),
        allowNull: true
      },
      longitude: {
        type: Sequelize.STRING( 20 ),
        allowNull: true
      },
      logo: {
        type: Sequelize.STRING( 20 ),
        defaultValue: 'default-logo.jpg'
      },
      date_founded: {
        type: Sequelize.DATE,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      land_size: {
        type: Sequelize.STRING( 20 ),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM,
        values: [ 'active', 'blocked', 'deleted' ],
        defaultValue: 'active'
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
    await queryInterface.dropTable( 'Farms' );
  }
};
