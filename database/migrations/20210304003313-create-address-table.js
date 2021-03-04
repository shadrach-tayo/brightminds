'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DataTypes = Sequelize;
    await queryInterface.createTable('address', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      city: {
        type: DataTypes.STRING(45),
      },

      state: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },

      lga: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },

      street: {
        type: DataTypes.STRING(45),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('address');
  },
};
