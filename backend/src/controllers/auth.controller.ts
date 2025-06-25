import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AppError } from '../utils/appError';
import { sendResponse } from '../utils/sendReponse';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const user = await authService.registerUser(username, email, password);
    sendResponse({
      res,
      statusCode: 201,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err: any) {
    throw new AppError(err.message, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const tokens = await authService.loginUser(email, password);
    sendResponse({
        res,
        message: 'Login successful',
        data: tokens,
      });
  } catch (err: any) {
    throw new AppError(err.message, 401);
  }
};
