'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DataTypes = Sequelize;
    await queryInterface.createTable('plan', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      is_active: DataTypes.BOOLEAN,

      plan_name: DataTypes.STRING(255),

      description: DataTypes.STRING(255),

      price: DataTypes.INTEGER,

      valid_from: DataTypes.DATE,

      valid_to: {
        type: DataTypes.DATE,
        defaultValue: new Date(new Date().getFullYear(), 11, 31),
      },
    });
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
