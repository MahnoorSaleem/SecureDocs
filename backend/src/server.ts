import app from './app'
import config from './config/config';
import { connectToDB } from './config/mongoose';
import logger from './utils/logger';

connectToDB()
app.listen(config.port, ()=> {
    logger.info(`Server running on port ${config.port}`)
    console.log(`Server running on port ${config.port}`);
})