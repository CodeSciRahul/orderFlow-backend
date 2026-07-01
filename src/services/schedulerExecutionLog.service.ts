import { HTTP_STATUS, MESSAGES } from '../constants';
import {
  CreateSchedulerExecutionLogDto,
  GetSchedulerExecutionLogsQueryDto,
  SchedulerExecutionLogResponseDto,
  toSchedulerExecutionLogResponseDto,
  toSchedulerExecutionLogResponseDtoList,
} from '../dto/schedulerExecutionLog.dto';
import { ExecutionStatus } from '../enums';
import {
  ISchedulerExecutionLog,
  ISchedulerExecutionLogFilter,
  ISchedulerExecutionLogRepository,
} from '../interfaces/schedulerExecutionLog.interface';
import { schedulerExecutionLogRepository } from '../repositories';
import { AppError } from '../utils';

export class SchedulerExecutionLogService {
  constructor(
    private readonly repository: ISchedulerExecutionLogRepository,
  ) {}

  public async createLog(
    dto: CreateSchedulerExecutionLogDto,
  ): Promise<SchedulerExecutionLogResponseDto> {
    const data: ISchedulerExecutionLog = {
      startedAt: dto.startedAt ? new Date(dto.startedAt) : new Date(),
      completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
      checkedOrders: dto.checkedOrders,
      updatedOrders: dto.updatedOrders,
      failedOrders: dto.failedOrders,
      executionStatus: dto.executionStatus,
      executionTime: dto.executionTime,
    };

    const log = await this.repository.create(data);
    return toSchedulerExecutionLogResponseDto(log);
  }

  public async getLogs(
    query: GetSchedulerExecutionLogsQueryDto,
  ): Promise<SchedulerExecutionLogResponseDto[]> {
    const filter: ISchedulerExecutionLogFilter = {};

    if (query.executionStatus) {
      filter.executionStatus = query.executionStatus as ExecutionStatus;
    }

    if (query.fromDate) {
      filter.fromDate = new Date(query.fromDate);
    }

    if (query.toDate) {
      filter.toDate = new Date(query.toDate);
    }

    const logs = await this.repository.findAll(filter);
    return toSchedulerExecutionLogResponseDtoList(logs);
  }

  public async getLastLog(): Promise<SchedulerExecutionLogResponseDto> {
    const log = await this.repository.findLastExecutionLog();

    if (!log) {
      throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return toSchedulerExecutionLogResponseDto(log);
  }

  public async getLogById(id: string): Promise<SchedulerExecutionLogResponseDto> {
    const log = await this.repository.findById(id);

    if (!log) {
      throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return toSchedulerExecutionLogResponseDto(log);
  }
}

export const schedulerExecutionLogService = new SchedulerExecutionLogService(
  schedulerExecutionLogRepository,
);
