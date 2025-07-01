import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import config, {corsOrigin as allowedOrigin} from './config/config';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(express.json());

if (config.nodeEnv === 'production') {
  app.use(
    cors({
      origin: allowedOrigin,
      credentials: true,
    }),
  );
} else {
  app.use(
    cors({
      origin: allowedOrigin,
      credentials: true,
    }),
  );
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
    max: 100, // Limit each IP to 100 requests per `window`
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/docs', documentRoutes);

app.use(globalErrorHandler);

export default app;
