'use strict';

module.exports = {
  up: async ( queryInterface, Sequelize ) => {
    return await queryInterface.bulkInsert( 'system_policies', [ {
      crowd_fund_percentage: 10,
      investment_maturity_additional_days: 30,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    } ] );
  },

  down: async ( queryInterface, Sequelize ) => {
    return await queryInterface.bulkDelete( 'system_policies', null, {} );
  }
};
