'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('subscription', 'plan_id');
    await queryInterface.addColumn('subscription', 'plan_id', {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: 'plan',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('subscription', 'plan_id', {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: 'plans',
        key: 'id',
      },
    });
    await queryInterface.removeColumn('subscription', 'plan_id', {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: 'plan',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      defaultValue: null,
    });
  },
};
