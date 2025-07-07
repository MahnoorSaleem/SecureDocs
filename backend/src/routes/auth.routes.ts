import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { isAuth } from '../middlewares/auth.middleware';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.post('/register', validate(registerSchema), catchAsync(authController.register));
router.post('/login', validate(loginSchema), catchAsync(authController.login));
router.post('/refresh-token', catchAsync(authController.refreshToken));
router.post('/logout', isAuth, catchAsync(authController.logout));

export default router;
