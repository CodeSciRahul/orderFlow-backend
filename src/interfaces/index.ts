import { Request } from 'express';

export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: IApiMeta;
  errors?: IValidationError[];
  stack?: string;
}

export interface IApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export interface IValidationError {
  field: string;
  message: string;
}

export interface IAuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IDatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}

export type { IOrder, IOrderDocument } from './order.interface';
export type {
  IOrderStatusHistory,
  IOrderStatusHistoryDocument,
  IOrderStatusHistoryRepository,
} from './orderStatusHistory.interface';
export type {
  ISchedulerExecutionLog,
  ISchedulerExecutionLogDocument,
} from './schedulerExecutionLog.interface';
export type {
  ICreateOrderData,
  IOrderFilter,
  IOrderRepository,
} from './orderRepository.interface';
