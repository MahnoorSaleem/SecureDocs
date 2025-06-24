import { connect, set } from 'mongoose';
import config from './config';

const MONGO_DB_URI = config.MONGO_DB_URI;

// connection to db
export const connectToDB = async () => {
  try {
    set('strictQuery', false);
    const db = await connect(MONGO_DB_URI);
    console.log('MongoDB connected to', db.connection.name);
    
    const collectionsList = await db.connection.listCollections()
    console.log('MongoDB collections list', collectionsList);

    // Emit an event when the connection is successful
  } catch (error) {
    console.error(error);
    // Emit an event when there's an error
  }
};