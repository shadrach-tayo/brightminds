/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.production') });

const dbConfig = {
  development: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'brightminds',
    host: process.env.MYSQL_HOST || '127.0.0.1',
    logging: true,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: 'password',
    database: 'brightminds',
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  },
};

module.exports = dbConfig;
