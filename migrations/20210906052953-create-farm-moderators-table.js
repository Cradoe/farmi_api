'use strict';

module.exports = {
  up: async ( queryInterface, Sequelize ) => {
    await queryInterface.createTable( 'farm_moderators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        allowNull: false
      },
      farm_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'farms'
          },
          key: 'id'
        },
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: [ 'active', 'blocked', 'deleted', 'pending' ],
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
    await queryInterface.dropTable( 'farm_moderators' );
  }
};
