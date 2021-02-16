import DB from '../database';

function databaseLoader() {
  return DB.sequelize.sync({ force: false });
}

export default databaseLoader;
