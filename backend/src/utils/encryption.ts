import crypto from 'crypto';

export const generateAESKey = () => crypto.randomBytes(32);

export const encryptBuffer = (buffer: Buffer, key: Buffer) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { iv, encrypted };
};

export const encryptAESKeyWithRSA = (aesKey: Buffer, publicKeyPem: string) => {
  return crypto.publicEncrypt(publicKeyPem, aesKey).toString('base64');
};
