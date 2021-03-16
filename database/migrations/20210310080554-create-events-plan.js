'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('events_plan', {
      id: {
        primaryKey: true,
        unique: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      eventId: {
        type: Sequelize.UUID,
        field: 'event_id',
        // references: {
        //   model: 'events',
        //   key: 'id',
        // },
      },
      planId: {
        type: Sequelize.UUID,
        field: 'plan_id',
        // references: {
        //   model: 'plan',
        //   key: 'id',
        // },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('events_plan');
  },
};
