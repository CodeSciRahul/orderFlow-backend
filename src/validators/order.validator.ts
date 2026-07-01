import { body, query } from 'express-validator';
import { ORDER_STATUS_VALUES } from '../enums';

const PHONE_NUMBER_REGEX = /^\+?[1-9]\d{6,14}$/;

export const createOrderValidator = [
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(PHONE_NUMBER_REGEX)
    .withMessage(
      'Phone number must be a valid international format (7–15 digits, optional leading +)',
    ),

  body('productName')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than zero'),
];

export const getOrdersValidator = [
  query('status')
    .optional()
    .isIn(ORDER_STATUS_VALUES)
    .withMessage(`Status must be one of: ${ORDER_STATUS_VALUES.join(', ')}`),
];
