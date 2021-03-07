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

        status: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },

        amount_paid: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },

        transaction_ref: {
          type: Sequelize.STRING(255),
          unique: true,
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
