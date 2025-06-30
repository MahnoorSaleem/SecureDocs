import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';
import { AppError } from '../utils/appError';

export const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message).join(', ');
      throw new AppError(`Validation failed: ${messages}`, 400);
    }
    next();
  };


  export const validateParams = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.params);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }
      next();
    };
  };
  
