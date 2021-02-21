// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const dbConfig = {
  development: {
    username: 'root',
    password: 'password',
    database: 'brightminds',
    host: '127.0.0.1',
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
