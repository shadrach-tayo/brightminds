'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('events', 'start_date', {
      type: Sequelize.DATEONLY,
    });

    await queryInterface.changeColumn('events', 'end_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    // await queryInterface.addColumn('events', 'location', {
    //   type: Sequelize.STRING(255),
    // });

    // await queryInterface.removeColumn('events', 'addressId', {
    //   type: Sequelize.UUID,
    //   field: 'address_id',
    //   references: {
    //     model: 'address',
    //     key: 'id',
    //   },
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('events', 'start_date', {
      type: Sequelize.DATE,
    });

    await queryInterface.changeColumn('events', 'end_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.removeColumn('events', 'location', {
      type: Sequelize.STRING(255),
    });

    await queryInterface.addColumn('events', 'addressId', {
      type: Sequelize.UUID,
      field: 'address_id',
      // references: {
      //   model: 'address',
      //   key: 'id',
      // },
    });
  },
};
