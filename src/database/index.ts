import Sequelize from 'sequelize';
import config from '../config';
import { logger } from '../utils/logger';
import userFactory from '../models/users.model';
import adminFactory from '../models/admin.model';
import eventFactory from '../models/events.model';
import addressFactory from '../models/address.model';
import transactionFactory from '../models/transaction.model';
import competitionFactory from '../models/competition.model';

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize.Sequelize(config[env].database, config[env].username, config[env].password, {
  host: config[env].host,
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
    // console.log(
    //   `🚀 The database is connected.${JSON.stringify(config[env].host)}${JSON.stringify(config[env].database)}${JSON.stringify(
    //     config[env].username,
    //   )}${JSON.stringify(config[env].password)}`,
    // );
  })
  .catch((error: Error) => {
    console.log(
      `${JSON.stringify(config[env].host)} ${JSON.stringify(config[env].database)} ${JSON.stringify(config[env].username)} 
      ${JSON.stringify(config[env].password)}`,
    );
    logger.error(`🔴 Unable to connect to the sdatabase: ${error}.`);
  });

const AdminModel = adminFactory(sequelize);
const AddressModel = addressFactory(sequelize);
const TransactionModel = transactionFactory(sequelize);
const CompetitionModel = competitionFactory(sequelize, { TransactionModel, AddressModel });
const EventModel = eventFactory(sequelize, { AddressModel, TransactionModel });
const UserModel = userFactory(sequelize, { AddressModel });

const DB = {
  Users: UserModel,
  Admins: AdminModel,
  Events: EventModel,
  Address: AddressModel,
  Competitions: CompetitionModel,
  Transactions: TransactionModel,
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

export default DB;
