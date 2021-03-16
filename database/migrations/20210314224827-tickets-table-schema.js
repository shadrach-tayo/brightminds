'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('tickets', 'amount_paid');
    // await queryInterface.removeColumn('tickets', 'quantity');
    // await queryInterface.removeColumn('tickets', 'transaction_ref');
    // await queryInterface.removeColumn('tickets', 'status');
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('tickets', 'quantity', {
    //   type: Sequelize.INTEGER,
    //   defaultValue: 0,
    // });
    // await queryInterface.addColumn('tickets', 'quantity', {
    //   type: Sequelize.INTEGER,
    // });
    // await queryInterface.addColumn('tickets', 'transaction_ref', {
    //   type: Sequelize.STRING(255),
    //   unique: true,
    // });
    // await queryInterface.addColumn('tickets', 'status', {
    //   type: Sequelize.INTEGER,
    //   defaultValue: 1,
    // });
  },
};
