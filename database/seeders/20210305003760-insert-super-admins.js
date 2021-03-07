/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const uuid = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('admins', null, {});
    const password = await bcrypt.hash('aaaaaa', 10);
    return queryInterface.bulkInsert('admins', [
      {
        id: uuid.v4(),
        email: 'super@gmail.com',
        firstname: 'super',
        lastname: 'admin',
        password: password,
        role: 'super_admin',
        avatar_url: '',
        phone_number: '+23489664538',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid.v4(),
        email: 'super1@gmail.com',
        firstname: 'super1',
        lastname: 'admins',
        password: password,
        role: 'super_admin',
        avatar_url: '',
        phone_number: '+23489664538',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('admins', null, { where: { role: 'super_admin' } });
  },
};
