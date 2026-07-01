import { SCHEDULER_TRANSITION_RULES } from '../constants/scheduler.constants';
import { ExecutionStatus, OrderStatus } from '../enums';
import { IOrderDocument } from '../interfaces/order.interface';
import { IOrderRepository } from '../interfaces/orderRepository.interface';
import { IOrderStatusHistoryRepository } from '../interfaces/orderStatusHistory.interface';
import {
  SchedulerSummary,
  SchedulerTransitionResult,
} from '../interfaces/scheduler.interface';
import { ISchedulerExecutionLogRepository } from '../interfaces/schedulerExecutionLog.interface';
import {
  orderRepository,
  orderStatusHistoryRepository,
  schedulerExecutionLogRepository,
} from '../repositories';

export class SchedulerService {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly historyRepo: IOrderStatusHistoryRepository,
    private readonly executionLogRepo: ISchedulerExecutionLogRepository,
  ) {}

  public async execute(): Promise<SchedulerSummary> {
    const startedAt = new Date();
    const startTime = Date.now();

    const transitions: SchedulerTransitionResult[] = [];

    for (const rule of SCHEDULER_TRANSITION_RULES) {
      const result = await this.processTransition(rule);
      transitions.push(result);
    }

    const checkedOrders = transitions.reduce((sum, t) => sum + t.checked, 0);
    const updatedOrders = transitions.reduce((sum, t) => sum + t.updated, 0);
    const failedOrders = transitions.reduce((sum, t) => sum + t.failed, 0);
    const completedAt = new Date();
    const executionTime = Date.now() - startTime;
    const executionStatus = this.resolveExecutionStatus(
      updatedOrders,
      failedOrders,
    );

    await this.executionLogRepo.create({
      startedAt,
      completedAt,
      checkedOrders,
      updatedOrders,
      failedOrders,
      executionStatus,
      executionTime,
    });

    return {
      startedAt,
      completedAt,
      checkedOrders,
      updatedOrders,
      failedOrders,
      executionStatus,
      executionTime,
      transitions,
    };
  }

  private async processTransition(rule: {
    fromStatus: OrderStatus;
    toStatus: OrderStatus;
    thresholdMinutes: number;
  }): Promise<SchedulerTransitionResult> {
    const eligibleOrders = await this.orderRepo.findByStatusOlderThan(
      rule.fromStatus,
      rule.thresholdMinutes,
    );

    let updated = 0;
    let failed = 0;

    for (const order of eligibleOrders) {
      const success = await this.transitionOrder(
        order,
        rule.fromStatus,
        rule.toStatus,
      );

      if (success) {
        updated++;
      } else {
        failed++;
      }
    }

    return {
      fromStatus: rule.fromStatus,
      toStatus: rule.toStatus,
      checked: eligibleOrders.length,
      updated,
      failed,
    };
  }

  private async transitionOrder(
    order: IOrderDocument,
    fromStatus: OrderStatus,
    toStatus: OrderStatus,
  ): Promise<boolean> {
    try {
      const updatedOrder = await this.orderRepo.updateOrderStatus(
        order.orderId,
        toStatus,
      );

      if (!updatedOrder) {
        return false;
      }

      await this.historyRepo.create({
        orderId: order.orderId,
        fromStatus,
        toStatus,
        changedAt: new Date(),
      });

      return true;
    } catch {
      return false;
    }
  }

  private resolveExecutionStatus(
    updatedOrders: number,
    failedOrders: number,
  ): ExecutionStatus {
    if (failedOrders === 0) {
      return ExecutionStatus.SUCCESS;
    }

    if (updatedOrders === 0) {
      return ExecutionStatus.FAILED;
    }

    return ExecutionStatus.PARTIAL_FAILURE;
  }
}

export const schedulerService = new SchedulerService(
  orderRepository,
  orderStatusHistoryRepository,
  schedulerExecutionLogRepository,
);
