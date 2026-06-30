import { Schema, model } from 'mongoose';
import { EXECUTION_STATUS_VALUES } from '../enums';
import { ISchedulerExecutionLogDocument } from '../interfaces/schedulerExecutionLog.interface';

const schedulerExecutionLogSchema = new Schema<ISchedulerExecutionLogDocument>(
  {
    startedAt: {
      type: Date,
      required: [true, 'Start time is required'],
      default: Date.now,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
      validate: {
        validator: function (this: ISchedulerExecutionLogDocument, value: Date | null) {
          if (value === null) return true;
          return value >= this.startedAt;
        },
        message: 'Completed at must be greater than or equal to started at',
      },
    },
    checkedOrders: {
      type: Number,
      required: [true, 'Checked orders count is required'],
      default: 0,
      min: [0, 'Checked orders cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Checked orders must be an integer',
      },
    },
    updatedOrders: {
      type: Number,
      required: [true, 'Updated orders count is required'],
      default: 0,
      min: [0, 'Updated orders cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Updated orders must be an integer',
      },
    },
    failedOrders: {
      type: Number,
      required: [true, 'Failed orders count is required'],
      default: 0,
      min: [0, 'Failed orders cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Failed orders must be an integer',
      },
    },
    executionStatus: {
      type: String,
      required: [true, 'Execution status is required'],
      enum: {
        values: EXECUTION_STATUS_VALUES,
        message: 'Execution status must be one of: {VALUE}',
      },
      default: EXECUTION_STATUS_VALUES[0],
      index: true,
    },
    executionTime: {
      type: Number,
      required: [true, 'Execution time is required'],
      default: 0,
      min: [0, 'Execution time cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Execution time must be an integer (milliseconds)',
      },
    },
  },
  {
    timestamps: false,
    collection: 'scheduler_execution_logs',
    versionKey: false,
  },
);

schedulerExecutionLogSchema.index({ startedAt: -1 });
schedulerExecutionLogSchema.index({ executionStatus: 1, startedAt: -1 });

schedulerExecutionLogSchema.pre('save', function (next) {
  const totalProcessed = this.updatedOrders + this.failedOrders;

  if (totalProcessed > this.checkedOrders) {
    next(
      new Error(
        'Sum of updated and failed orders cannot exceed checked orders count',
      ),
    );
    return;
  }

  next();
});

export const SchedulerExecutionLogModel = model<ISchedulerExecutionLogDocument>(
  'SchedulerExecutionLog',
  schedulerExecutionLogSchema,
);
