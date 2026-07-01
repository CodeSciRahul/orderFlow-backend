import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '../constants';
import { env } from '../config';
import { AppError } from '../utils';

const API_KEY_HEADERS = ['x-api-key', 'x-scheduler-api-key'] as const;

export function schedulerAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!env.schedulerApiKey) {
    if (env.isProduction) {
      next(
        new AppError(
          'Scheduler API key is not configured',
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ),
      );
      return;
    }

    next();
    return;
  }

  const providedKey = API_KEY_HEADERS.map(
    (header) => req.headers[header],
  ).find((value): value is string => typeof value === 'string');

  if (!providedKey || providedKey !== env.schedulerApiKey) {
    next(new AppError('Unauthorized scheduler request', HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  next();
}
