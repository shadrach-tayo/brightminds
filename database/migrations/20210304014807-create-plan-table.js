'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'plan',
      {
        id: {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },

        is_active: Sequelize.BOOLEAN,

        plan_name: Sequelize.STRING(255),

        description: Sequelize.STRING(255),

        price: Sequelize.INTEGER,

        valid_from: Sequelize.DATE,

        valid_to: {
          type: Sequelize.DATE,
          defaultValue: new Date(new Date().getFullYear(), 11, 31),
        },

        created_at: {
          type: Sequelize.DATE,
        },

        updated_at: {
          type: Sequelize.DATE,
        },
      },
      {
        tableName: 'plan',
        modelName: 'Plan',
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
    await queryInterface.dropTable('plan');
  },
};
