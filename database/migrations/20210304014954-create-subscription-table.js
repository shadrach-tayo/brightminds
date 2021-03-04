'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DataTypes = Sequelize;
    await queryInterface.createTable('subscription', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      valid_from: DataTypes.DATE,

      valid_to: DataTypes.DATE,

      date_subscribed: DataTypes.DATE,

      date_unsubscribed: DataTypes.DATE,

      transaction_ref: {
        type: DataTypes.STRING(255),
        unique: true,
      },

      userId: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('subscription');
  },
};
