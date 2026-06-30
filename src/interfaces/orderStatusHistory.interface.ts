import { Document, Types } from 'mongoose';
import { OrderStatus } from '../enums';

export interface IOrderStatusHistory {
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedAt: Date;
}

export interface IOrderStatusHistoryDocument
  extends IOrderStatusHistory,
    Document {
  _id: Types.ObjectId;
}
