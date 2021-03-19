'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'competitions',
      {
        id: {
          primaryKey: true,
          unique: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },

        title: {
          allowNull: false,
          type: Sequelize.STRING(45),
        },

        description: {
          allowNull: false,
          type: Sequelize.STRING(255),
        },

        banner: {
          allowNull: false,
          type: Sequelize.STRING(255),
        },

        opening_date: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        closing_date: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        created_at: {
          type: Sequelize.DATE,
        },

        updated_at: {
          type: Sequelize.DATE,
        },
      },
      {
        tableName: 'competitions',
        modelName: 'Competitions',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('competitions');
  },
};
