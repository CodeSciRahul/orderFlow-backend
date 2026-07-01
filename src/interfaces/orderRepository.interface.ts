import { OrderStatus, PaymentStatus } from '../enums';
import { IOrderDocument } from './order.interface';

export interface ICreateOrderData {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  productName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}

export interface IOrderFilter {
  orderStatus?: OrderStatus;
}

export interface IOrderRepository {
  create(data: ICreateOrderData): Promise<IOrderDocument>;
  findAll(filter: IOrderFilter): Promise<IOrderDocument[]>;
  existsByOrderId(orderId: string): Promise<boolean>;
  findByStatusOlderThan(
    orderStatus: OrderStatus,
    olderThanMinutes: number,
  ): Promise<IOrderDocument[]>;
  updateOrderStatus(
    orderId: string,
    orderStatus: OrderStatus,
  ): Promise<IOrderDocument | null>;
}
