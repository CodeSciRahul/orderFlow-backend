import { HTTP_STATUS } from '../constants';
import {
  CreateOrderDto,
  GetOrdersQueryDto,
  OrderResponseDto,
  toOrderResponseDto,
  toOrderResponseDtoList,
} from '../dto';
import { OrderStatus, PaymentStatus } from '../enums';
import { IOrderRepository } from '../interfaces/orderRepository.interface';
import { AppError } from '../utils';
import { generateOrderId } from '../utils/orderIdGenerator';
import { orderRepository } from '../repositories';

const MAX_ORDER_ID_RETRIES = 5;

export class OrderService {
  constructor(private readonly repository: IOrderRepository) {}

  public async createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const orderId = await this.generateUniqueOrderId();

    const order = await this.repository.create({
      orderId,
      customerName: dto.customerName,
      phoneNumber: dto.phoneNumber,
      productName: dto.productName,
      amount: dto.amount,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PLACED,
    });

    return toOrderResponseDto(order);
  }

  public async getOrders(
    query: GetOrdersQueryDto,
  ): Promise<OrderResponseDto[]> {
    const filter = query.status
      ? { orderStatus: query.status as OrderStatus }
      : {};

    const orders = await this.repository.findAll(filter);
    return toOrderResponseDtoList(orders);
  }

  private async generateUniqueOrderId(): Promise<string> {
    for (let attempt = 0; attempt < MAX_ORDER_ID_RETRIES; attempt++) {
      const orderId = generateOrderId();
      const exists = await this.repository.existsByOrderId(orderId);

      if (!exists) {
        return orderId;
      }
    }

    throw new AppError(
      'Unable to generate a unique order ID',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
}

export const orderService = new OrderService(orderRepository);
