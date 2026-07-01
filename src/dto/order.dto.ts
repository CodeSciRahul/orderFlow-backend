import { IOrderDocument } from '../interfaces/order.interface';

export interface CreateOrderDto {
  customerName: string;
  phoneNumber: string;
  productName: string;
  amount: number;
}

export interface GetOrdersQueryDto {
  status?: string;
}

export interface OrderResponseDto {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  productName: string;
  amount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toOrderResponseDto = (
  order: IOrderDocument,
): OrderResponseDto => ({
  orderId: order.orderId,
  customerName: order.customerName,
  phoneNumber: order.phoneNumber,
  productName: order.productName,
  amount: order.amount,
  paymentStatus: order.paymentStatus,
  orderStatus: order.orderStatus,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

export const toOrderResponseDtoList = (
  orders: IOrderDocument[],
): OrderResponseDto[] => orders.map(toOrderResponseDto);
