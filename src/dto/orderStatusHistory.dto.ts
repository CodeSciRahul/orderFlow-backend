import { OrderStatus } from '../enums';
import { IOrderStatusHistoryDocument } from '../interfaces/orderStatusHistory.interface';

export interface OrderStatusHistoryItemDto {
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedAt: Date;
}

export interface OrderStatusHistoryResponseDto {
  orderId: string;
  status: OrderStatusHistoryItemDto[];
}

export const toOrderStatusHistoryResponseDto = (
  orderId: string,
  histories: IOrderStatusHistoryDocument[],
): OrderStatusHistoryResponseDto => ({
  orderId,
  status: histories.map(({ fromStatus, toStatus, changedAt }) => ({
    fromStatus,
    toStatus,
    changedAt,
  })),
});

export interface CreateOrderStatusHistoryDto {
  orderId: string,
  fromStatus: OrderStatus | null,
  toStatus: OrderStatus,
}