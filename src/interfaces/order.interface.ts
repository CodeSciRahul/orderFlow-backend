import { Document, Types } from 'mongoose';
import { OrderStatus, PaymentStatus } from '../enums';

export interface IOrder {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  productName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document {
  _id: Types.ObjectId;
}
