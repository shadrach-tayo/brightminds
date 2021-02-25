'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    console.log('migrating');
    await queryInterface.dropTable('users');
    // await queryInterface.addColumn('users', 'username', {
    //   allowNull: false,
    //   unique: true,
    //   type: Sequelize.DataTypes.STRING(45),
    // });
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        unique: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },

      email: {
        allowNull: true,
        unique: true,
        type: Sequelize.DataTypes.STRING(45),
      },

      password: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING(255),
      },

      gender: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING(6),
      },

      firstname: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING(45),
      },

      school: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING(45),
      },

      lastname: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING(45),
      },

      role: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING(45),
      },

      avatar_url: Sequelize.DataTypes.STRING(255),

      dob: Sequelize.DataTypes.DATE,

      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.DataTypes.STRING(45),
      },

      phoneNumber: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING(14),
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
