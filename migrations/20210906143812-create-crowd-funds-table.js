'use strict';

module.exports = {
  up: async ( queryInterface, Sequelize ) => {
    await queryInterface.createTable( 'crowd_funds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      title: {
        type: Sequelize.STRING( 100 ),
        allowNull: false
      },
      amount_needed: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      investment_deadline: {
        type: Sequelize.DATE,
        allowNull: false
      },
      maturity_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      roi: {
        type: Sequelize.STRING( 20 ),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: [ 'pending', 'active', 'matured', 'running', 'blocked', 'deleted' ],
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
    await queryInterface.dropTable( 'crowd_funds' );
  }
};
