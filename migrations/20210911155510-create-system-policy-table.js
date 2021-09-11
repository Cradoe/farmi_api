'use strict';

module.exports = {
  up: async ( queryInterface, Sequelize ) => {
    await queryInterface.createTable( 'system_policies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      crowd_fund_percentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: '10'
      },
      investment_maturity_additional_days: {
        type: Sequelize.INTEGER( 20 ),
        allowNull: false,
        defaultValue: 30
      },
      status: {
        type: Sequelize.ENUM,
        values: [ 'active', 'inactive' ],
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
    await queryInterface.dropTable( 'system_policies' );
  }
};
