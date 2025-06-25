import jwt from 'jsonwebtoken';
import config from '../config/config';

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.JWT_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};
