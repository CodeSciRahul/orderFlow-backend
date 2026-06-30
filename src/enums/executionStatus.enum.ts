export const ExecutionStatus = {
  RUNNING: 'running',
  SUCCESS: 'success',
  PARTIAL_FAILURE: 'partial_failure',
  FAILED: 'failed',
} as const;

export type ExecutionStatus =
  (typeof ExecutionStatus)[keyof typeof ExecutionStatus];

export const EXECUTION_STATUS_VALUES = Object.values(ExecutionStatus);
