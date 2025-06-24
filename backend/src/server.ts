import app from './app'
import config from './config/config';
import { connectToDB } from './config/mongoose';

connectToDB()
app.listen(config.port, ()=> {
    console.log(`Server running on port ${config.port}`);
})