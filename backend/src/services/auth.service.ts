import config from '../config/config';
import redis from '../config/redis';
import User, { IUser } from '../models/user';
import * as jwtUtils from '../utils/jwt';
import logger from '../utils/logger';

export const registerUser = async (username: string, email: string, password: string): Promise<IUser> => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');
  const user = new User({ username, email, password });
  await user.save();
  return user;
};

export const loginUser = async (email: string, password: string, context: any) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isValidPassword(password))) {
    logger.error('Invalid email or password', {
      ...context,
      email,
      userId: user?._id
    })
    throw new Error('Invalid email or password');
  }

  const accessToken = jwtUtils.generateAccessToken(user._id.toString(), context);
  const refreshToken = jwtUtils.generateRefreshToken(user._id.toString(), context);

  await redis.set(
    `refresh:${user._id}`,
    refreshToken,
    'EX',
    config.JWT_REFRESH_TOKEN_EXPIRY
  );

  logger.info('user login successful', { ...context, accessToken, refreshToken, user: { id: user._id, email: user.email }})

  return { accessToken, refreshToken, user: { id: user._id, email: user.email } };
};
