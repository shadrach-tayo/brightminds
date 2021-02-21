import 'dotenv/config';
// import dotenv from 'dotenv';
import App from './app';
import AuthRoute from './routes/auth.route';
import IndexRoute from './routes/index.route';
import PlansRoute from './routes/plans.route';
import UsersRoute from './routes/users.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new PlansRoute()]);

app.listen();
