import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const user = await authService.registerUser(username, email, password);
    res.status(201).json({ message: 'User registered', user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const tokens = await authService.loginUser(email, password);
    res.status(200).json(tokens);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};
