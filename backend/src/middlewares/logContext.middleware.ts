import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    logContext?: {
      requestId?: string;
      path?: string;
      method?: string;
    };
  }
}

export const attachLogContext = (req: Request, res: Response, next: NextFunction) => {
  req.logContext = {
    requestId: req.id,
    path: req.originalUrl,
    method: req.method,
  };
  next();
};
