'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    queryInterface.bulkDelete('plan', null, {});
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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Plan', null, {});
  },
};
