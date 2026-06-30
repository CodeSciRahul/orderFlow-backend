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
