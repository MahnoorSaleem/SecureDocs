import dotenv from 'dotenv';

dotenv.config();


interface Config {
    port: number;
    nodeEnv: string;
    MONGO_DB_URI: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.nodeEnv || 'development',
    MONGO_DB_URI: process.env.MONGO_DB_URI  || 'test'
}

export default config;