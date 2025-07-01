import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import config, {corsOrigin as allowedOrigin} from './config/config';

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

app.use('/api/auth', authRoutes);
app.use('/api/docs', documentRoutes);

app.use(globalErrorHandler);

export default app;
