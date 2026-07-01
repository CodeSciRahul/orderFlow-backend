import { Document, Types } from 'mongoose';
import { ExecutionStatus } from '../enums';

export interface ISchedulerExecutionLog {
  startedAt: Date;
  completedAt: Date | null;
  checkedOrders: number;
  updatedOrders: number;
  failedOrders: number;
  executionStatus: ExecutionStatus;
  executionTime: number;
}

export interface ISchedulerExecutionLogDocument
  extends ISchedulerExecutionLog,
    Document {
  _id: Types.ObjectId;
}


export interface ISchedulerExecutionLogFilter {
  executionStatus?: ExecutionStatus;
  fromDate?: Date;
  toDate?: Date;
}

export interface ISchedulerExecutionLogRepository {
  create(data: ISchedulerExecutionLog): Promise<ISchedulerExecutionLogDocument>;
  findLastExecutionLog(): Promise<ISchedulerExecutionLogDocument | null>;
  findAll(filter: ISchedulerExecutionLogFilter): Promise<ISchedulerExecutionLogDocument[]>;
  findById(id: string): Promise<ISchedulerExecutionLogDocument | null>;
}

