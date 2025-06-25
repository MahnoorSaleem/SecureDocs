import User, { IUser } from '../models/user';
import * as jwtUtils from '../utils/jwt';

export const registerUser = async (username: string, email: string, password: string): Promise<IUser> => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');
  const user = new User({ username, email, password });
  await user.save();
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isValidPassword(password))) {
    throw new Error('Invalid email or password');
  }

  const accessToken = jwtUtils.generateAccessToken(user._id.toString());
  const refreshToken = jwtUtils.generateRefreshToken(user._id.toString());

  return { accessToken, refreshToken, user: { id: user._id, email: user.email } };
};
