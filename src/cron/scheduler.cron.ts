import cron, { ScheduledTask } from 'node-cron';

import { SCHEDULER_CRON_EXPRESSION } from '../constants/scheduler.constants';
import { env } from '../config';
import { schedulerService } from '../services';

let scheduledTask: ScheduledTask | null = null;
let isRunning = false;

export function startSchedulerCron(): void {
  if (!env.schedulerCronEnabled) {
    console.info('[SchedulerCron] Disabled via SCHEDULER_CRON_ENABLED');
    return;
  }

  if (scheduledTask) {
    return;
  }

  if (!cron.validate(SCHEDULER_CRON_EXPRESSION)) {
    throw new Error(
      `Invalid scheduler cron expression: ${SCHEDULER_CRON_EXPRESSION}`,
    );
  }

  scheduledTask = cron.schedule(
    SCHEDULER_CRON_EXPRESSION,
    () => {
      void runScheduler();
    },
    { timezone: 'UTC' },
  );

  console.info(
    `[SchedulerCron] Started — runs every 5 minutes (${SCHEDULER_CRON_EXPRESSION} UTC)`,
  );
}

export function stopSchedulerCron(): void {
  if (!scheduledTask) {
    return;
  }

  scheduledTask.stop();
  scheduledTask = null;
  console.info('[SchedulerCron] Stopped');
}

async function runScheduler(): Promise<void> {
  if (isRunning) {
    console.warn('[SchedulerCron] Previous run still in progress, skipping');
    return;
  }

  isRunning = true;
  const startedAt = Date.now();

  try {
    const summary = await schedulerService.execute();

    console.info('[SchedulerCron] Completed', {
      executionStatus: summary.executionStatus,
      checkedOrders: summary.checkedOrders,
      updatedOrders: summary.updatedOrders,
      failedOrders: summary.failedOrders,
      executionTimeMs: summary.executionTime,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error('[SchedulerCron] Failed', error);
  } finally {
    isRunning = false;
  }
}
