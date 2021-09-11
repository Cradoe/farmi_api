'use strict';

module.exports = {
  up: async ( queryInterface, Sequelize ) => {
    await queryInterface.createTable( 'crowd_fund_payback_remitances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      crowd_fund_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'crowd_funds'
          },
          key: 'id'
        },
        allowNull: false
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      txref: {
        type: Sequelize.STRING( 20 ),
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
    await queryInterface.dropTable( 'crowd_fund_payback_remitances' );
  }
};
