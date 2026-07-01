import {
  OrderStatusHistoryResponseDto,
  toOrderStatusHistoryResponseDto,
} from '../dto/orderStatusHistory.dto';
import {
  IOrderStatusHistory,
  IOrderStatusHistoryDocument,
  IOrderStatusHistoryRepository,
} from '../interfaces/orderStatusHistory.interface';
import { orderStatusHistoryRepository } from '../repositories';

export class OrderStatusHistoryService {
  constructor(
    private readonly repository: IOrderStatusHistoryRepository,
  ) {}

  public async createHistory(
    data: IOrderStatusHistory,
  ): Promise<IOrderStatusHistoryDocument> {
    return this.repository.create(data);
  }

  public async getOrderHistory(
    orderId: string,
  ): Promise<OrderStatusHistoryResponseDto> {
    const histories = await this.repository.findByOrderId(orderId);
    return toOrderStatusHistoryResponseDto(orderId, histories);
  }
}

export const orderStatusHistoryService = new OrderStatusHistoryService(
  orderStatusHistoryRepository,
);
