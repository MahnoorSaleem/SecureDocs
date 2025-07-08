import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

declare module 'express-serve-static-core' {
  interface Request {
    id?: string;
  }
}

export const assignRequestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = crypto.randomUUID();
  next();
};
