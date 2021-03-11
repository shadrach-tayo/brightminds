'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'tickets',
      {
        id: {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },

        created_at: {
          type: Sequelize.DATE,
        },

        updated_at: {
          type: Sequelize.DATE,
        },

        eventId: {
          type: Sequelize.UUID,
          allowNull: false,
          field: 'event_id',
          references: {
            model: 'events',
            key: 'id',
          },
        },

        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id',
          },
        },
      },
      {
        timestamps: true,
        tableName: 'tickets',
        modelName: 'Tickets',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tickets');
  },
};
