'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DataTypes = Sequelize;
    await queryInterface.createTable('events', {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      title: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      description: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      image_url: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      startDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      endDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
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
