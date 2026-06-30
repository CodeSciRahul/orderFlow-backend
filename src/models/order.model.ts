import { Schema, model } from 'mongoose';
import { PAYMENT_STATUS_VALUES, ORDER_STATUS_VALUES } from '../enums';
import { IOrderDocument } from '../interfaces/order.interface';

const PHONE_NUMBER_REGEX = /^\+?[1-9]\d{6,14}$/;
const ORDER_ID_REGEX = /^ORD-[A-Z0-9]{8,20}$/;

const orderSchema = new Schema<IOrderDocument>(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [
        ORDER_ID_REGEX,
        'Order ID must follow the format ORD-XXXXXXXX (8–20 alphanumeric characters)',
      ],
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters'],
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        PHONE_NUMBER_REGEX,
        'Phone number must be a valid international format (7–15 digits, optional leading +)',
      ],
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      validate: {
        validator: (value: number) => Number.isFinite(value),
        message: 'Amount must be a valid number',
      },
    },
    paymentStatus: {
      type: String,
      required: [true, 'Payment status is required'],
      enum: {
        values: PAYMENT_STATUS_VALUES,
        message: 'Payment status must be one of: {VALUE}',
      },
      default: PAYMENT_STATUS_VALUES[0],
    },
    orderStatus: {
      type: String,
      required: [true, 'Order status is required'],
      enum: {
        values: ORDER_STATUS_VALUES,
        message: 'Order status must be one of: {VALUE}',
      },
      default: ORDER_STATUS_VALUES[0],
    },
  },
  {
    timestamps: true,
    collection: 'orders',
    versionKey: false,
  },
);

orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ phoneNumber: 1 });

export const OrderModel = model<IOrderDocument>('Order', orderSchema);
