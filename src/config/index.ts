const dbConfig = {
  development: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'brightminds',
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
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
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  },
};

export default dbConfig;
