'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.renameTable('plans', 'plan');
    // await queryInterface.removeColumn('subscription', 'plans_id');
    // await queryInterface.addColumn('subscription', 'plan_id', {
    //   type: Sequelize.DataTypes.UUID,
    //   references: {
    //     model: 'plan',
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    //   defaultValue: null,
    //   after: 'user_id',
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('plan', 'plans');
    await queryInterface.addColumn('subscription', 'plans_id');
    await queryInterface.removeColumn('subscription', 'plan_id', {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: 'plan',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      defaultValue: null,
      after: 'user_id',
    });
  },
};
