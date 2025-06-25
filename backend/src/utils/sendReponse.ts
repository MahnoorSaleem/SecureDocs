// utils/sendResponse.ts
import { Response } from 'express';

interface SendResponseOptions {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: any;
  meta?: any;
}

export const sendResponse = ({
  res,
  statusCode = 200,
  message = 'Success',
  data = null,
  meta = null,
}: SendResponseOptions) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
    ...(meta && { meta }),
  });
};
