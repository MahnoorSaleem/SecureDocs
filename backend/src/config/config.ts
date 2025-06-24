import dotenv from 'dotenv';

dotenv.config();


interface Config {
    port: number;
    nodeEnv: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.nodeEnv || 'development'
}

export default config;