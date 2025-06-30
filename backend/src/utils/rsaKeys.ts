import fs from 'fs';
import path from 'path';

export const SERVER_PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, '../keys/public.pem'),
  'utf-8'
);
