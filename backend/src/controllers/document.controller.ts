import { Response } from 'express';
import * as encryption from '../utils/encryption';
import * as s3Service from '../services/s3.service';
import Document from '../models/document';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendResponse } from '../utils/sendReponse';
import { SERVER_PUBLIC_KEY } from '../utils/rsaKeys';
import { logWithContext } from '../utils/contextualLogger';

export const uploadSingle = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const context = { ...req.logContext, apiName: '/upload' };
  const file = req.file;
  const userId = req?.user!.id;
  if (!file) {
    logWithContext('error', 'No file uploaded', context, {
      ip: req.ip,
      requestBody: { userId, file },
      request: {
        ip: req.ip,
        userId: req.user?.id,
        params: req.params,
        body: req.body,
      },
      response: {
        statusCode: 400,
        message: 'No file uploaded',
        file
      }
    });
    throw new AppError('No file uploaded', 400);
  }

  const aesKey = encryption.generateAESKey();
  const { iv, encrypted } = encryption.encryptBuffer(file.buffer, aesKey);
  const s3Key = `docs/${userId}/${Date.now()}-${file.originalname}`;

  await s3Service.uploadFileToS3(s3Key, encrypted, file.mimetype);

  const encryptedAESKey = encryption.encryptAESKeyWithRSA(
    aesKey,
    SERVER_PUBLIC_KEY!,
  );

  const doc = await Document.create({
    ownerId: userId,
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype,
    s3Key,
    encryptedAESKey,
  });
  logWithContext('info', 'Document uploaded successfully', context, {
    request: {
      ip: req.ip,
      userId: req.user?.id,
      params: req.params,
      body: req.body,
    },
    response: {
      statusCode: 201,
      message: 'Document uploaded successfully',
      data:  {documentId: doc._id,
      ownerId: userId,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype}
    },
  });
  sendResponse({
    res,
    statusCode: 201,
    message: 'File uploaded',
    data: { documentId: doc._id },
  });
};

export const getDownloadUrl = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const context = { ...req.logContext, apiName: '/download' };

  const doc = await Document.findById(req.params.id);
  if (!doc || doc.ownerId.toString() !== req.user!.id) {
    logWithContext('error', 'Document not found', context, {
      request: {
        ip: req.ip,
        userId: req.user?.id,
        params: req.params,
        body: req.body,
      },
      response: {
        statusCode: 404,
        message: 'Document not found'
      },
    });
    throw new AppError('Document not found', 404);
  }

  const url = s3Service.getPresignedUrl(doc.s3Key);
  logWithContext('info', 'Download URL', context, {
    request: {
      ip: req.ip,
      userId: req.user?.id,
      params: req.params,
      body: req.body,
    },
    response: {
      statusCode: 200,
      message: 'File Download URL',
      downloadUrl: url
    },
  });
  sendResponse({
    res,
    data: { downloadUrl: url },
  });
};

export const deleteFile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const context = { ...req.logContext, apiName: '/delete' };

  const doc = await Document.findById(req.params.id);
  if (!doc || doc.ownerId.toString() !== req.user!.id) {
    logWithContext('error', 'Document not found', context, {
      request: {
        ip: req.ip,
        userId: req.user?.id,
        params: req.params,
        body: req.body,
      },
      response: {
        statusCode: 404,
        message: 'Document not found',
      },
    });
    throw new AppError('Document not found', 404);
  }

  await s3Service.deleteFromS3(doc.s3Key);
  await doc.deleteOne();
  logWithContext('info', 'File Deleted', context, {
    request: {
      ip: req.ip,
      userId: req.user?.id,
      params: req.params,
      body: req.body,
    },
    response: {
      statusCode: 200,
      message: 'File Deleted',
    },
  });
  sendResponse({
    res,
    message: 'File Deleted',
  });
};

export const uploadMultiple = async (req: AuthRequest, res: Response) => {
  const context = { ...req.logContext, apiName: '/upload-multiple' };

  const files = req.files as Express.Multer.File[];
  const userId = req.user?.id;

  if (!files || files.length === 0) {
    logWithContext('error', 'No files uploaded', context, {
      request: {
        ip: req.ip,
        userId: req.user?.id,
        params: req.params,
        body: req.body,
        files
      },
      response: {
        statusCode: 400,
        message: 'No files uploaded',
      }
    });
    throw new AppError('No files uploaded', 400);
  }

  const uploadedDocuments = [];

  for (const file of files) {
    const aesKey = encryption.generateAESKey();
    const { iv, encrypted } = encryption.encryptBuffer(file.buffer, aesKey);
    const s3Key = `docs/${userId}/${Date.now()}-${file.originalname}`;

    await s3Service.uploadFileToS3(s3Key, encrypted, file.mimetype);

    const encryptedAESKey = encryption.encryptAESKeyWithRSA(
      aesKey,
      SERVER_PUBLIC_KEY!,
    );
    
    logWithContext('info', 'File details', context, {
      requestBody: {
        ownerId: userId,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      },
    });
    const doc = await Document.create({
      ownerId: userId,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      s3Key,
      encryptedAESKey,
    });

    uploadedDocuments.push({
      documentId: doc._id,
      fileName: doc.fileName,
      size: doc.fileSize,
    });
  }
  logWithContext('info', 'Files uploaded successfully', context, {
    requestBody: { userId, documents: uploadedDocuments },
  });

  sendResponse({
    res,
    message: 'Files uploaded successfully',
    data: uploadedDocuments,
  });
};
