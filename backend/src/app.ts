import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import config, { corsOrigin as allowedOrigin } from './config/config';
import { customRateLimiter } from './middlewares/rateLimiter';
import helmet from 'helmet';

const app = express();

app.use(express.json());
app.use(helmet());

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
app.use(customRateLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/docs', documentRoutes);

app.use(globalErrorHandler);

export default app;
