import { OrderStatus } from '../enums';

export const SCHEDULER_INTERVAL_MS = 5 * 60 * 1000;
export const SCHEDULER_CRON_EXPRESSION = '*/5 * * * *';

export const PLACED_TO_PROCESSING_THRESHOLD_MINUTES = 10;
export const PROCESSING_TO_READY_TO_SHIP_THRESHOLD_MINUTES = 20;

export interface SchedulerTransitionRule {
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  thresholdMinutes: number;
}

export const SCHEDULER_TRANSITION_RULES: SchedulerTransitionRule[] = [
  {
    fromStatus: OrderStatus.PLACED,
    toStatus: OrderStatus.PROCESSING,
    thresholdMinutes: PLACED_TO_PROCESSING_THRESHOLD_MINUTES,
  },
  {
    fromStatus: OrderStatus.PROCESSING,
    toStatus: OrderStatus.READY_TO_SHIP,
    thresholdMinutes: PROCESSING_TO_READY_TO_SHIP_THRESHOLD_MINUTES,
  },
];
