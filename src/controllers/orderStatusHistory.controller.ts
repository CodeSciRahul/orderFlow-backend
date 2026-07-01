import { Request, Response } from "express";
import { CreateOrderStatusHistoryDto } from "../dto/orderStatusHistory.dto";
import { orderStatusHistoryService } from "../services";
import { HTTP_STATUS, MESSAGES } from "../constants";
import { ResponseHelper } from "../utils";
import { IOrderStatusHistory } from "../interfaces/orderStatusHistory.interface";

export class OrderStatusHistoryController {
    public async createOrderStatusHistory(req: Request, res: Response): Promise<void> {
        const dto: CreateOrderStatusHistoryDto = {
            orderId: req.body.orderId,
            fromStatus: req.body.fromStatus,
            toStatus: req.body.toStatus,
        }

        const data: IOrderStatusHistory = {
            orderId: dto.orderId,
            fromStatus: dto.fromStatus,
            toStatus: dto.toStatus,
            changedAt: new Date(),
        }

        const orderStatusHistory = await orderStatusHistoryService.createHistory(data)

        res.status(HTTP_STATUS.CREATED).json(ResponseHelper.success(MESSAGES.CREATED, orderStatusHistory));
    }
    public async getOrderStatusHistory(req: Request, res: Response): Promise<void> {
        const orderId = req.params.orderId as string;
        const orderStatusHistory = await orderStatusHistoryService.getOrderHistory(orderId)
        res.status(HTTP_STATUS.OK).json(ResponseHelper.success(MESSAGES.SUCCESS, orderStatusHistory));
    }
}


export const orderStatusHistoryController = new OrderStatusHistoryController();