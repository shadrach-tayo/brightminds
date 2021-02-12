import DB from '../database';

function databaseLoader() {
  DB.sequelize.sync({ force: false });
}

export default databaseLoader;
