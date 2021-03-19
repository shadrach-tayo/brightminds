import 'dotenv/config';
// import dotenv from 'dotenv';
import App from './app';
import AdminRoute from './routes/admin.route';
import AuthRoute from './routes/auth.route';
import CompetitionsRoute from './routes/competitions.route';
import EventsRoute from './routes/events.route';
import IndexRoute from './routes/index.route';
import PlansRoute from './routes/plans.route';
import SubscriptionRoute from './routes/subscription.route';
import UsersRoute from './routes/users.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([
  new IndexRoute(),
  new AdminRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new PlansRoute(),
  new SubscriptionRoute(),
  new EventsRoute(),
  new CompetitionsRoute(),
]);

app.listen();
