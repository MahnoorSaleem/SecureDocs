import dotenv from 'dotenv';

dotenv.config();


interface Config {
    port: number;
    nodeEnv: string;
    MONGO_DB_URI: string;
    salt: number;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string
}

const config: Config = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    MONGO_DB_URI: process.env.MONGO_DB_URI  || 'test',
    salt: Number(process.env.SALT) || 10,
    JWT_SECRET: process.env.JWT_SECRET || 'secretKey',
    JWT_REFRESH_SECRET:  process.env.JWT_REFRESH_SECRET || 'refreshsecretKey',
}

export default config;