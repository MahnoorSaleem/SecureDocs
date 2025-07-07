import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import config from '../config/config';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new WinstonCloudWatch({
      logGroupName: 'SecureDocsAppLogs',
      logStreamName: `app-stream-${new Date().toISOString().slice(0,10)}`,
      awsRegion: config.AWS_REGION,
      awsAccessKeyId: config.AWS_ACCESS_KEY_ID,
      awsSecretKey: config.AWS_SECRET_ACCESS_KEY,
      jsonMessage: true,
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export default logger;
