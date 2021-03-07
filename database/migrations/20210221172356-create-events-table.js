'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'events',
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

        image_url: {
          type: Sequelize.STRING(255),
        },

        start_date: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        start_date: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        addressId: {
          type: Sequelize.UUID,
          field: 'address_id',
          references: {
            model: 'address',
            key: 'id',
          },
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
        tableName: 'events',
        modelName: 'Events',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('events');
  },
};
