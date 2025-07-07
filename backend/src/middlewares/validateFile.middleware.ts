import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

export const validateSingleFile = (
  allowedMimeTypes: string[],
  maxSizeMB = 10,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
      logger.warn('File is required', {
        file,
        path: req.originalUrl,
        method: req.method,
      });
      return next(new AppError('File is required', 400));
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      logger.warn('Invalid file type', {
        file,
        path: req.originalUrl,
        method: req.method,
      });

      return next(new AppError(`Invalid file type: ${file.mimetype}`, 400));
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      logger.warn(`File size exceeds ${maxSizeMB} MB`, {
        file,
        path: req.originalUrl,
        method: req.method,
        allowedMaxSizeMB: maxSizeMB,
        uploadedFileSizeMB: sizeMB
      });

      return next(new AppError(`File size exceeds ${maxSizeMB} MB`, 400));
    }

    next();
  };
};

export const validateMultipleFiles = (
  allowedMimeTypes: string[],
  maxSizeMB = 10,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      logger.warn('At least one file is required', {
        files,
        path: req.originalUrl,
        method: req.method,
      });

      return next(new AppError('At least one file is required', 400));
    }

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        logger.warn('Invalid file type', {
          file,
          path: req.originalUrl,
          method: req.method,
        });

        return next(
          new AppError(`Invalid file type: ${file.originalname}`, 400),
        );
      }

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        logger.warn(`${file.originalname} exceeds ${maxSizeMB} MB`, {
          file,
          path: req.originalUrl,
          method: req.method,
          allowedMaxSizeMB: maxSizeMB,
          uploadedFileSizeMB: sizeMB
        });

        return next(
          new AppError(`${file.originalname} exceeds ${maxSizeMB} MB`, 400),
        );
      }
    }

    next();
  };
};
