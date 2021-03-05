'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'admins',
      {
        id: {
          primaryKey: true,
          unique: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },

        email: {
          allowNull: false,
          type: Sequelize.STRING(45),
        },

        password: {
          allowNull: false,
          type: Sequelize.STRING(255),
        },

        firstname: {
          allowNull: false,
          type: Sequelize.STRING(45),
        },

        lastname: {
          allowNull: false,
          type: Sequelize.STRING(45),
        },

        role: {
          allowNull: false,
          type: Sequelize.STRING(45),
        },

        avatar_url: Sequelize.STRING(255),

        phone_number: {
          allowNull: false,
          type: Sequelize.STRING(14),
        },

        created_at: {
          type: Sequelize.DATE,
        },

        updated_at: {
          type: Sequelize.DATE,
        },
      },
      {
        timestamps: true,
        tableName: 'admins',
        modelName: 'Admins',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('users');
  },
};
