import { Request, Response } from 'express';
import { HTTP_STATUS, MESSAGES } from '../constants';
import {
  CreateSchedulerExecutionLogDto,
  GetSchedulerExecutionLogsQueryDto,
} from '../dto/schedulerExecutionLog.dto';
import { ExecutionStatus } from '../enums';
import { asyncHandler } from '../middlewares';
import { schedulerExecutionLogService } from '../services';
import { ResponseHelper } from '../utils';

export class SchedulerExecutionLogController {
  public createLog = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const dto: CreateSchedulerExecutionLogDto = {
        startedAt: req.body.startedAt,
        completedAt: req.body.completedAt,
        checkedOrders: Number(req.body.checkedOrders),
        updatedOrders: Number(req.body.updatedOrders),
        failedOrders: Number(req.body.failedOrders),
        executionStatus: req.body.executionStatus as ExecutionStatus,
        executionTime: Number(req.body.executionTime),
      };

      const log = await schedulerExecutionLogService.createLog(dto);

      res
        .status(HTTP_STATUS.CREATED)
        .json(ResponseHelper.success(MESSAGES.CREATED, log));
    },
  );

  public getLogs = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const query: GetSchedulerExecutionLogsQueryDto = {
        executionStatus: req.query.executionStatus as string | undefined,
        fromDate: req.query.fromDate as string | undefined,
        toDate: req.query.toDate as string | undefined,
      };

      const logs = await schedulerExecutionLogService.getLogs(query);

      res
        .status(HTTP_STATUS.OK)
        .json(ResponseHelper.success(MESSAGES.SUCCESS, logs));
    },
  );

  public getLastLog = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const log = await schedulerExecutionLogService.getLastLog();

      res
        .status(HTTP_STATUS.OK)
        .json(ResponseHelper.success(MESSAGES.SUCCESS, log));
    },
  );

  public getLogById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const log = await schedulerExecutionLogService.getLogById(
        req.params.id as string,
      );

      res
        .status(HTTP_STATUS.OK)
        .json(ResponseHelper.success(MESSAGES.SUCCESS, log));
    },
  );
}

export const schedulerExecutionLogController =
  new SchedulerExecutionLogController();
