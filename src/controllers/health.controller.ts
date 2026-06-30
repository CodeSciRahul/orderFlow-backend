import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares';
import { ResponseHelper } from '../utils';
import { MESSAGES } from '../constants';
import { database } from '../config';

export class HealthController {
  public getHealth = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const healthData = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: database.isConnected() ? 'connected' : 'disconnected',
      };

      res.status(200).json(ResponseHelper.success(MESSAGES.SUCCESS, healthData));
    },
  );
}

export const healthController = new HealthController();
