import { ExecutionStatus } from '../enums';

export interface SchedulerTransitionResult {
  fromStatus: string;
  toStatus: string;
  checked: number;
  updated: number;
  failed: number;
}

export interface SchedulerSummary {
  startedAt: Date;
  completedAt: Date;
  checkedOrders: number;
  updatedOrders: number;
  failedOrders: number;
  executionStatus: ExecutionStatus;
  executionTime: number;
  transitions: SchedulerTransitionResult[];
}
