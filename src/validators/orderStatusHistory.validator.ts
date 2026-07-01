import { body, param } from 'express-validator';
import { ORDER_STATUS_VALUES } from '../enums';

const ORDER_ID_REGEX = /^ORD-[A-Z0-9]{8,20}$/;

export const createOrderStatusHistoryValidator = [
  body('orderId')
    .trim()
    .notEmpty()
    .withMessage('Order ID is required')
    .matches(ORDER_ID_REGEX)
    .withMessage(
      'Order ID must follow the format ORD-XXXXXXXX (8–20 alphanumeric characters)',
    ),

  body('fromStatus')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined) {
        return true;
      }

      if (!ORDER_STATUS_VALUES.includes(value)) {
        throw new Error(
          `From status must be one of: ${ORDER_STATUS_VALUES.join(', ')}`,
        );
      }

      return true;
    }),

  body('toStatus')
    .notEmpty()
    .withMessage('To status is required')
    .isIn(ORDER_STATUS_VALUES)
    .withMessage(`To status must be one of: ${ORDER_STATUS_VALUES.join(', ')}`),

  body('fromStatus').custom((value, { req }) => {
    if (value != null && value === req.body?.toStatus) {
      throw new Error('From status and to status cannot be the same');
    }

    return true;
  }),
];

export const getOrderStatusHistoryValidator = [
  param('orderId')
    .trim()
    .notEmpty()
    .withMessage('Order ID is required')
    .matches(ORDER_ID_REGEX)
    .withMessage(
      'Order ID must follow the format ORD-XXXXXXXX (8–20 alphanumeric characters)',
    ),
];
