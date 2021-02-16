import expressLoader from './express';
import databaseLoader from './db';
import awsLoader from './aws';

async function loaders(app: Express.Application): Promise<void> {
  await expressLoader(app);
  await databaseLoader();
  await awsLoader();
}

export default loaders;
