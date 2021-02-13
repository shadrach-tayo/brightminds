import 'dotenv/config';
// import dotenv from 'dotenv';
import App from './app';
import AuthRoute from './routes/auth.route';
import IndexRoute from './routes/index.route';
import UsersRoute from './routes/users.route';
import validateEnv from './utils/validateEnv';
// import path from 'path';

// if (process.env.NODE_ENV === 'development') {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const result = require('dotenv').config({ path: path.join(__dirname, '../.env.development') });
//   // const result = dotenv.config({
//   //   path: './.env.development',
//   // });
//   console.log('env ', process.env.NODE_ENV, result);
// } else {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   require('dotenv').config({ path: path.join(__dirname, '../.env.production') });
// }
validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute()]);

app.listen();
