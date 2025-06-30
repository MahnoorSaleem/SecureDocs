// services/s3.service.ts
import AWS from 'aws-sdk';
import config from '../config/config';

const s3 = new AWS.S3({
  region: config.AWS_REGION,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

export const uploadFileToS3 = async (key: string, buffer: Buffer, mimeType: string) => {
  await s3
    .putObject({
      Bucket: config.S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    })
    .promise();
};

export const getPresignedUrl = (key: string) => {
  return s3.getSignedUrl('getObject', {
    Bucket: config.S3_BUCKET!,
    Key: key,
    Expires: 60 * 10, // 10 minutes
  });
};

export const deleteFromS3 = (key: string) => {
  return s3.deleteObject({ Bucket: config.S3_BUCKET!, Key: key }).promise();
};
