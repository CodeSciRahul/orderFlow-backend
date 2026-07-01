import { OrderModel } from '../models';
import {
  ICreateOrderData,
  IOrderFilter,
  IOrderRepository,
} from '../interfaces/orderRepository.interface';
import { IOrderDocument } from '../interfaces/order.interface';

export class OrderRepository implements IOrderRepository {
  public async create(data: ICreateOrderData): Promise<IOrderDocument> {
    const order = await OrderModel.create(data);
    return order;
  }

  public async findAll(filter: IOrderFilter): Promise<IOrderDocument[]> {
    const query = filter.orderStatus
      ? { orderStatus: filter.orderStatus }
      : {};

    return OrderModel.find(query).sort({ createdAt: -1 }).exec();
  }

  public async existsByOrderId(orderId: string): Promise<boolean> {
    const order = await OrderModel.exists({ orderId });
    return order !== null;
  }
}

export const orderRepository = new OrderRepository();
