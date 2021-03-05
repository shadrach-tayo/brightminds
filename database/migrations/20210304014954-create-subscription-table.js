'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'subscription',
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

        amount: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },

        valid_from: Sequelize.DATE,

        valid_to: Sequelize.DATE,

        date_subscribed: Sequelize.DATE,

        date_unsubscribed: Sequelize.DATE,

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

        userId: {
          type: Sequelize.UUID,
          unique: true,
          allowNull: false,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id',
          },
        },
        planId: {
          type: Sequelize.UUID,
          field: 'plan_id',
          allowNull: false,
          references: {
            model: 'plan',
            key: 'id',
          },
        },
      },
      {
        timestamps: true,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('subscription');
  },
};
