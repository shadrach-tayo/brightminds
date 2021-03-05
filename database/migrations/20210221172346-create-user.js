'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'users',
      {
        id: {
          primaryKey: true,
          unique: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },

        email: {
          allowNull: true,
          unique: true,
          type: Sequelize.STRING(45),
        },

        password: {
          allowNull: false,
          type: Sequelize.STRING(255),
        },

        gender: {
          allowNull: false,
          type: Sequelize.STRING(6),
        },

        firstname: {
          allowNull: false,
          type: Sequelize.STRING(45),
        },

        school: {
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

        dob: Sequelize.DATE,

        username: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING(45),
        },

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

        deleted_at: {
          type: Sequelize.DATE,
        },

        addressId: {
          type: Sequelize.UUID,
          unique: true,
          field: 'address_id',
          references: {
            model: 'address',
            key: 'id',
          },
        },
      },
      {
        paranoid: true,
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
    await queryInterface.dropTable('users');
  },
};
