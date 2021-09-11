'use strict';

module.exports = {
  up: async ( queryInterface, Sequelize ) => {
    await queryInterface.createTable( 'company_profits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      crowd_fund_payback_remitance_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'crowd_fund_payback_remitances'
          },
          key: 'id'
        },
        allowNull: false
      },
      system_policy_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'system_policies'
          },
          key: 'id'
        },
        allowNull: false
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: [ 'pending', 'success', 'failed' ],
        defaultValue: 'success'
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
    await queryInterface.dropTable( 'company_profits' );
  }
};
