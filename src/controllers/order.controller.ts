import { Request, Response } from 'express';
import { HTTP_STATUS, MESSAGES } from '../constants';
import { CreateOrderDto, GetOrdersQueryDto } from '../dto';
import { asyncHandler } from '../middlewares';
import { orderService } from '../services';
import { ResponseHelper } from '../utils';

export class OrderController {
  public createOrder = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const dto: CreateOrderDto = {
        customerName: req.body?.customerName,
        phoneNumber: req.body?.phoneNumber,
        productName: req.body?.productName,
        amount: Number(req.body?.amount),
      };

      const order = await orderService?.createOrder(dto);

      res
        .status(HTTP_STATUS.CREATED)
        .json(ResponseHelper.success(MESSAGES.CREATED, order));
    },
  );

  public getOrders = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const query: GetOrdersQueryDto = {
        status: req.query.status as string | undefined,
      };

      const orders = await orderService?.getOrders(query);

      res
        .status(HTTP_STATUS.OK)
        .json(ResponseHelper.success(MESSAGES.SUCCESS, orders));
    },
  );
}

export const orderController = new OrderController();
