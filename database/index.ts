import Sequelize from 'sequelize';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import config from '../src/config';
import { logger } from '../src/utils/logger';
import userFactory from '../src/models/users.model';
import adminFactory from '../src/models/admin.model';
import eventFactory from '../src/models/events.model';
import addressFactory from '../src/models/address.model';
import transactionFactory from '../src/models/transaction.model';
import competitionFactory from '../src/models/competition.model';
import plansFactory from '../src/models/plans.model';
import subscriptionFactory from '../src/models/subscription.model';
import invoiceFactory from '../src/models/invoice.model';
import TicketFactory from '../src/models/tickets.model';
import eventsPlanFactory from '../src/models/event_plans.model';
const env = process.env.NODE_ENV || 'development';
console.log(config[env].database, config[env].username, config[env].password, config[env].host, config[env].port);
const sequelize = new Sequelize.Sequelize(config[env].database, config[env].username, config[env].password, {
  host: config[env].host,
  port: config[env].port,
  dialect: config[env].dialect,
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: config[env].pool,
  logQueryParameters: env === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

sequelize
  .authenticate()
  .then(() => {
    logger.info(
      `🚀 The database is connected. ${process.env.NODE_ENV}
      ${JSON.stringify(config[env].host)}${JSON.stringify(config[env].database)}${JSON.stringify(config[env].username)}${JSON.stringify(
        config[env].password,
      )}
      `,
    );
  })
  .catch((error: Error) => {
    logger.error(`🔴 Unable to connect to the database: ${error}.`);
  });

const AdminModel = adminFactory(sequelize);
const AddressModel = addressFactory(sequelize);
const TransactionModel = transactionFactory(sequelize);
const CompetitionModel = competitionFactory(sequelize);
const EventModel = eventFactory(sequelize);
const PlansModel = plansFactory(sequelize);
const UserModel = userFactory(sequelize, { AddressModel });
const SubscriptionModel = subscriptionFactory(sequelize, { UserModel, PlansModel });
const InvoiceModel = invoiceFactory(sequelize, { PlansModel, SubscriptionModel, UserModel });
const TicketModel = TicketFactory(sequelize, { UserModel, EventModel });
const EventsPlanModel = eventsPlanFactory(sequelize, { EventModel, PlansModel });

const DB = {
  Users: UserModel,
  Admins: AdminModel,
  Events: EventModel,
  Address: AddressModel,
  Competitions: CompetitionModel,
  Transactions: TransactionModel,
  Plan: PlansModel,
  Subscriptions: SubscriptionModel,
  Invoice: InvoiceModel,
  Tickets: TicketModel,
  EventsPlan: EventsPlanModel,
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

export default DB;
