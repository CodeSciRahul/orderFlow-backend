import { Request, Response } from 'express';

import { HTTP_STATUS, MESSAGES } from '../constants';
import { asyncHandler } from '../middlewares';
import { schedulerService } from '../services';
import { ResponseHelper } from '../utils';

export class SchedulerController {
  public execute = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const summary = await schedulerService.execute();
      console.log("summary", summary)
      
      res
        .status(HTTP_STATUS.OK)
        .json(ResponseHelper.success(MESSAGES.SCHEDULER_EXECUTED, summary));
    },
  );
}

export const schedulerController = new SchedulerController();
