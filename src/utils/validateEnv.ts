import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MYSQL_USER: str(),
    MYSQL_PASSWORD: str(),
    MYSQL_HOST: str(),
    MYSQL_DATABASE: str(),
    JWT_SECRET: str(),
    BUCKET_NAME: str(),
    AWS_ACCESS_KEY_ID: str(),
    AWS_SECRET_ACCESS_KEY: str(),
    PAYSTACK_SECRET_KEY: str(),
  });
}

export default validateEnv;
