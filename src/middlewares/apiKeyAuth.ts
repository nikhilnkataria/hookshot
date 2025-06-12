import { Request, Response, NextFunction } from 'express';

import { API_KEY } from '../configs/constants';
import { checkIfPublicAPIs } from '../utils/helper';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  if (checkIfPublicAPIs(req.path)) return next();
  // if (!req.path.startsWith('/api')) return next();
  console.log('x-api-key:', req.header('x-api-key'));

  const clientKey = req.header('x-api-key');

  if (!clientKey || clientKey !== API_KEY) {
    return res.sendError('Unauthorized: Invalid or missing API key', 401);
  }

  next();
}
