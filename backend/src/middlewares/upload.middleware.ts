import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(), // store in memory before encrypting & uploading to S3
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
