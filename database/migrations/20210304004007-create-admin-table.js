'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DataTypes = Sequelize;
    await queryInterface.createTable('admin', {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      firstname: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      lastname: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      role: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },

      avatar_url: DataTypes.STRING(255),

      phoneNumber: {
        allowNull: false,
        type: DataTypes.STRING(14),
      },
    });
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
