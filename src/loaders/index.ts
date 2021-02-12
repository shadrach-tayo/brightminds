import expressLoader from './express';
import databaseLoader from './db';

async function loaders(app: Express.Application): Promise<void> {
  await expressLoader(app);
  await databaseLoader();
}

export default loaders;
