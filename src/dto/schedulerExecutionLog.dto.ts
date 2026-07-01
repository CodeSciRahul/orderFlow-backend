import { ExecutionStatus } from '../enums';
import { ISchedulerExecutionLogDocument } from '../interfaces/schedulerExecutionLog.interface';

export interface CreateSchedulerExecutionLogDto {
  startedAt?: string;
  completedAt?: string | null;
  checkedOrders: number;
  updatedOrders: number;
  failedOrders: number;
  executionStatus: ExecutionStatus;
  executionTime: number;
}

export interface GetSchedulerExecutionLogsQueryDto {
  executionStatus?: string;
  fromDate?: string;
  toDate?: string;
}

export interface SchedulerExecutionLogResponseDto {
  id: string;
  startedAt: Date;
  completedAt: Date | null;
  checkedOrders: number;
  updatedOrders: number;
  failedOrders: number;
  executionStatus: string;
  executionTime: number;
}

export const toSchedulerExecutionLogResponseDto = (
  log: ISchedulerExecutionLogDocument,
): SchedulerExecutionLogResponseDto => ({
  id: log._id.toString(),
  startedAt: log.startedAt,
  completedAt: log.completedAt,
  checkedOrders: log.checkedOrders,
  updatedOrders: log.updatedOrders,
  failedOrders: log.failedOrders,
  executionStatus: log.executionStatus,
  executionTime: log.executionTime,
});

export const toSchedulerExecutionLogResponseDtoList = (
  logs: ISchedulerExecutionLogDocument[],
): SchedulerExecutionLogResponseDto[] =>
  logs.map(toSchedulerExecutionLogResponseDto);
