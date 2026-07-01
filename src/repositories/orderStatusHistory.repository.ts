import {
  IOrderStatusHistory,
  IOrderStatusHistoryDocument,
  IOrderStatusHistoryRepository,
} from '../interfaces/orderStatusHistory.interface';
import { OrderStatusHistoryModel } from '../models/orderStatusHistory.model';

export class OrderStatusHistoryRepository implements IOrderStatusHistoryRepository {
  public async create(
    data: IOrderStatusHistory,
  ): Promise<IOrderStatusHistoryDocument> {
    return OrderStatusHistoryModel.create(data);
  }

  public async findByOrderId(
    orderId: string,
  ): Promise<IOrderStatusHistoryDocument[]> {
    return OrderStatusHistoryModel.find({ orderId })
      .sort({ changedAt: -1 })
      .exec();
  }
}

export const orderStatusHistoryRepository = new OrderStatusHistoryRepository();
