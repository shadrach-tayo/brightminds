/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
if (process.env.NODE_ENV === 'production'){
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env.production') });
}else if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == undefined){
  require('dotenv').config();
}



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
