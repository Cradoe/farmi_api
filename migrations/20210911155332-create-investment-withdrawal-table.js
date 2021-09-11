'use strict';

module.exports = {
  up: async ( queryInterface, Sequelize ) => {
    await queryInterface.createTable( 'investment_withdrawals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      investment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'investments'
          },
          key: 'id'
        },
        allowNull: false
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
      bank_account_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'bank_accounts'
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
        values: [ 'pending', 'success', 'paid', 'failed' ],
        defaultValue: 'pending'
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
    await queryInterface.dropTable( 'investment_withdrawals' );
  }
};
