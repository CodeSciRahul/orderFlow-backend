import { FilterQuery } from 'mongoose';
import {
  ISchedulerExecutionLog,
  ISchedulerExecutionLogDocument,
  ISchedulerExecutionLogFilter,
  ISchedulerExecutionLogRepository,
} from '../interfaces/schedulerExecutionLog.interface';
import { SchedulerExecutionLogModel } from '../models/schedulerExecutionLog.model';

export class SchedulerExecutionLogRepository
  implements ISchedulerExecutionLogRepository
{
  public async create(
    data: ISchedulerExecutionLog,
  ): Promise<ISchedulerExecutionLogDocument> {
    return SchedulerExecutionLogModel.create(data);
  }

  public async findLastExecutionLog(): Promise<ISchedulerExecutionLogDocument | null> {
    return SchedulerExecutionLogModel.findOne()
      .sort({ startedAt: -1 })
      .exec();
  }

  public async findAll(
    filter: ISchedulerExecutionLogFilter,
  ): Promise<ISchedulerExecutionLogDocument[]> {
    return SchedulerExecutionLogModel.find(this.buildFilter(filter))
      .sort({ startedAt: -1 })
      .exec();
  }

  public async findById(
    id: string,
  ): Promise<ISchedulerExecutionLogDocument | null> {
    return SchedulerExecutionLogModel.findById(id).exec();
  }

  private buildFilter(
    filter: ISchedulerExecutionLogFilter,
  ): FilterQuery<ISchedulerExecutionLogDocument> {
    const query: FilterQuery<ISchedulerExecutionLogDocument> = {};

    if (filter.executionStatus) {
      query.executionStatus = filter.executionStatus;
    }

    if (filter.fromDate || filter.toDate) {
      query.startedAt = {};

      if (filter.fromDate) {
        query.startedAt.$gte = filter.fromDate;
      }

      if (filter.toDate) {
        query.startedAt.$lte = filter.toDate;
      }
    }

    return query;
  }
}

export const schedulerExecutionLogRepository =
  new SchedulerExecutionLogRepository();
