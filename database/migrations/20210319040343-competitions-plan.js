'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('competition_plans', {
      id: {
        primaryKey: true,
        unique: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      competitionId: {
        type: Sequelize.UUID,
        field: 'competition_id',
        references: {
          model: 'competitions',
          key: 'id',
        },
      },
      planId: {
        type: Sequelize.UUID,
        field: 'plan_id',
        references: {
          model: 'plan',
          key: 'id',
        },
        created_at: {
          type: Sequelize.DATE,
        },

        updated_at: {
          type: Sequelize.DATE,
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('competition_plans');
  },
};
