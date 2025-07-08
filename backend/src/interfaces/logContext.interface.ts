export interface LogContext {
    requestId?: string;
    userId?: string;
    path?: string;
    method?: string;
    apiName?: string;
    [key: string]: any; // Allows extra fields safely
  }
  