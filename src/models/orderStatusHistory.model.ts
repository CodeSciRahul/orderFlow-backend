import { Schema, model } from 'mongoose';
import { ORDER_STATUS_VALUES, OrderStatus } from '../enums';
import { IOrderStatusHistoryDocument } from '../interfaces/orderStatusHistory.interface';

const orderStatusHistorySchema = new Schema<IOrderStatusHistoryDocument>(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    fromStatus: {
      type: String,
      default: null,
      validate: {
        validator: (value: string | null) =>
          value === null ||
          ORDER_STATUS_VALUES.includes(value as OrderStatus),
        message: 'From status must be a valid order status or null',
      },
    },
    toStatus: {
      type: String,
      required: [true, 'To status is required'],
      enum: {
        values: ORDER_STATUS_VALUES,
        message: 'To status must be one of: {VALUE}',
      },
    },
    changedAt: {
      type: Date,
      required: [true, 'Changed at timestamp is required'],
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: 'order_status_histories',
    versionKey: false,
  },
);

orderStatusHistorySchema.index({ orderId: 1, changedAt: -1 });

orderStatusHistorySchema.pre('save', function (next) {
  if (this.fromStatus !== null && this.fromStatus === this.toStatus) {
    next(new Error('From status and to status cannot be the same'));
    return;
  }
  next();
});

export const OrderStatusHistoryModel = model<IOrderStatusHistoryDocument>(
  'OrderStatusHistory',
  orderStatusHistorySchema,
);
