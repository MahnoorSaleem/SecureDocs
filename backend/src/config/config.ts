import dotenv from 'dotenv';
import { SERVER_PUBLIC_KEY } from '../utils/rsaKeys';
dotenv.config();


interface Config {
    port: number;
    nodeEnv: string;
    MONGO_DB_URI: string;
    salt: number;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    S3_BUCKET: string;
    SERVER_PUBLIC_KEY: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    MONGO_DB_URI: process.env.MONGO_DB_URI  || 'test',
    salt: Number(process.env.SALT) || 10,
    JWT_SECRET: process.env.JWT_SECRET || 'secretKey',
    JWT_REFRESH_SECRET:  process.env.JWT_REFRESH_SECRET || 'refreshsecretKey',
    AWS_REGION: process.env.AWS_REGION || "",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    S3_BUCKET: process.env.S3_BUCKET || "",
    SERVER_PUBLIC_KEY: SERVER_PUBLIC_KEY || "",
    
}

export default config;