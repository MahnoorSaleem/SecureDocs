import { Response } from 'express';
import * as encryption from '../utils/encryption';
import * as s3Service from '../services/s3.service';
import Document from '../models/document';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendResponse } from '../utils/sendReponse';
import { SERVER_PUBLIC_KEY } from '../utils/rsaKeys';
import logger from '../utils/logger';

export const uploadSingle = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const file = req.file;
  const userId = req?.user!.id;
  if (!file) {
    logger.warn('No file uploaded', {
      requestId: req.id,
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId,
      file,
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

  logger.info('Document uploaded successfully', {
    requestId: req.id,
    userId: req.user?.id,
    documentId: doc._id,
    ownerId: userId,
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype,
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
  const doc = await Document.findById(req.params.id);
  if (!doc || doc.ownerId.toString() !== req.user!.id) {
    logger.error('Document not found', {
      requestId: req.id,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
      payload: {
        requestedDocumentId: req.params.id,
        requesterUserId: req.user?.id,
        requesterIp: req.ip,
      },
    });
    throw new AppError('Document not found', 404);
  }

  const url = s3Service.getPresignedUrl(doc.s3Key);
  logger.info('Download URL', {
    requestId: req.id,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    requestedDocumentId: req.params.id,
    downloadUrl: url,
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
  const doc = await Document.findById(req.params.id);
  if (!doc || doc.ownerId.toString() !== req.user!.id) {
    logger.warn('Document not found', {
      requestId: req.id,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
      requestedDocumentId: req.params.id,
    });
    throw new AppError('Document not found', 404);
  }

  await s3Service.deleteFromS3(doc.s3Key);
  await doc.deleteOne();
  logger.info('File Deleted', {
    requestId: req.id,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    requestedDocumentId: req.params.id,
  });
  sendResponse({
    res,
    message: 'File Deleted',
  });
};

export const uploadMultiple = async (req: AuthRequest, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const userId = req.user?.id;

  if (!files || files.length === 0) {
    logger.warn('No files uploaded', {
      requestId: req.id,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
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
  logger.info('Files uploaded successfully', {
    requestId: req.id,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    documents: uploadedDocuments
  });
  sendResponse({
    res,
    message: 'Files uploaded successfully',
    data: uploadedDocuments,
  });
};
