'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('competition_entries', {
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

      entry: Sequelize.STRING(255),

      userId: {
        type: Sequelize.UUID,
        field: 'user_id',
        references: {
          model: 'users',
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
    await queryInterface.dropTable('competition_entries');
  },
};
