import  express from "express";
import authRoutes from "./routes/auth.routes";
import documentRoutes from "./routes/document.routes";

import { globalErrorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/docs', documentRoutes);

app.use(globalErrorHandler);

export default app;