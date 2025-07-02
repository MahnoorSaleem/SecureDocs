import { Response } from 'express';
import * as encryption from '../utils/encryption';
import * as s3Service from '../services/s3.service';
import Document from '../models/document';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendResponse } from '../utils/sendReponse';
import { SERVER_PUBLIC_KEY } from '../utils/rsaKeys';

export const uploadSingle = async (req: AuthRequest, res: Response): Promise<void> => {
  const file = req.file;
  const userId = req?.user!.id;
  if (!file) {
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
  sendResponse({
    res,
    statusCode: 201,
    message: 'File uploaded',
    data: {documentId: doc._id}
  });
};

export const getDownloadUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  const doc = await Document.findById(req.params.id);
  if (!doc || doc.ownerId.toString() !== req.user!.id) {
    throw new AppError('Document not found', 404);
  }

  const url = s3Service.getPresignedUrl(doc.s3Key);
  sendResponse({
    res,
    data: { downloadUrl: url },
  });
};

export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
  const doc = await Document.findById(req.params.id);
  if (!doc || doc.ownerId.toString() !== req.user!.id) {
    throw new AppError('Document not found', 404);
  }

  await s3Service.deleteFromS3(doc.s3Key);
  await doc.deleteOne();
  sendResponse({
    res,
    message: 'File Deleted'
  });
};


export const uploadMultiple = async (req: AuthRequest, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const userId = req.user?.id;
  
    if (!files || files.length === 0) {
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
        SERVER_PUBLIC_KEY!
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

    sendResponse({
      res,
      message: 'Files uploaded successfully',
      data: uploadedDocuments
    });
  };
  