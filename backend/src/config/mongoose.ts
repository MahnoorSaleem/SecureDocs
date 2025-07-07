import { connect, set } from 'mongoose';
import config from './config';
import logger from '../utils/logger';

const MONGO_DB_URI = config.MONGO_DB_URI;

// connection to db
export const connectToDB = async () => {
  try {
    set('strictQuery', false);
    const db = await connect(MONGO_DB_URI);
    console.log('MongoDB connected to', db.connection.name); // todo remove
    logger.info(`MongoDB connected to database: ${db.connection.name}`);
    
    const collectionsList = await db.connection.listCollections();
    logger.info('MongoDB collections:', { collections: collectionsList });
    // Emit an event when the connection is successful
  } catch (error: any) {
    console.error(error);
    logger.error('MongoDB connection error', { message: error.message, stack: error.stack });
    // Emit an event when there's an error
  }
};