import { LogContext } from '../interfaces/logContext.interface';
import logger from './logger';

export const logWithContext = (
  level: 'info' | 'warn' | 'error',
  message: string,
  context?: LogContext,
  data?: Record<string, any>
) => {
  logger[level](message, {
    ...context,
    ...(data || {}),
  });
};
