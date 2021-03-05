'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('plan', null, {});
    return queryInterface.bulkInsert('plan', [
      {
        id: uuid.v4(),
        is_active: true,
        plan_name: 'Monthly Plan',
        description: 'plan is a Monthly plan',
        price: 7000,
        valid_from: new Date(),
        valid_to: new Date(new Date().getFullYear(), 11, 31),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid.v4(),
        is_active: true,
        plan_name: 'Quaterly Plan',
        description: 'plan is a Quaterly plan',
        price: 5000,
        valid_from: new Date(),
        valid_to: new Date(new Date().getFullYear(), 11, 31),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid.v4(),
        is_active: true,
        plan_name: 'Premium Plan',
        description: 'plan is a Premium plan',
        price: 5000,
        valid_from: new Date(),
        valid_to: new Date(new Date().getFullYear(), 11, 31),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Plan', null, {});
  },
};
