import { body, param, query } from 'express-validator';
import { EXECUTION_STATUS_VALUES } from '../enums';

export const createSchedulerExecutionLogValidator = [
  body('startedAt')
    .optional()
    .isISO8601()
    .withMessage('Started at must be a valid ISO 8601 date'),

  body('completedAt')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Completed at must be a valid ISO 8601 date'),

  body('checkedOrders')
    .notEmpty()
    .withMessage('Checked orders count is required')
    .isInt({ min: 0 })
    .withMessage('Checked orders must be a non-negative integer'),

  body('updatedOrders')
    .notEmpty()
    .withMessage('Updated orders count is required')
    .isInt({ min: 0 })
    .withMessage('Updated orders must be a non-negative integer'),

  body('failedOrders')
    .notEmpty()
    .withMessage('Failed orders count is required')
    .isInt({ min: 0 })
    .withMessage('Failed orders must be a non-negative integer'),

  body('executionStatus')
    .notEmpty()
    .withMessage('Execution status is required')
    .isIn(EXECUTION_STATUS_VALUES)
    .withMessage(
      `Execution status must be one of: ${EXECUTION_STATUS_VALUES.join(', ')}`,
    ),

  body('executionTime')
    .notEmpty()
    .withMessage('Execution time is required')
    .isInt({ min: 0 })
    .withMessage('Execution time must be a non-negative integer (milliseconds)'),

  body('updatedOrders').custom((value, { req }) => {
    const checked = Number(req.body?.checkedOrders);
    const failed = Number(req.body?.failedOrders);

    if (Number(value) + failed > checked) {
      throw new Error(
        'Sum of updated and failed orders cannot exceed checked orders count',
      );
    }

    return true;
  }),
];

export const getSchedulerExecutionLogsValidator = [
  query('executionStatus')
    .optional()
    .isIn(EXECUTION_STATUS_VALUES)
    .withMessage(
      `Execution status must be one of: ${EXECUTION_STATUS_VALUES.join(', ')}`,
    ),

  query('fromDate')
    .optional()
    .isISO8601()
    .withMessage('From date must be a valid ISO 8601 date'),

  query('toDate')
    .optional()
    .isISO8601()
    .withMessage('To date must be a valid ISO 8601 date'),
];

export const getSchedulerExecutionLogByIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Log ID is required')
    .isMongoId()
    .withMessage('Log ID must be a valid MongoDB ID'),
];
