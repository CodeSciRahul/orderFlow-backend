import { Router } from 'express';
import { schedulerExecutionLogController } from '../../controllers';
import { validateRequest } from '../../middlewares';
import {
  createSchedulerExecutionLogValidator,
  getSchedulerExecutionLogByIdValidator,
  getSchedulerExecutionLogsValidator,
} from '../../validators';

const router = Router();

router.post(
  '/',
  createSchedulerExecutionLogValidator,
  validateRequest,
  schedulerExecutionLogController.createLog,
);

router.get(
  '/',
  getSchedulerExecutionLogsValidator,
  validateRequest,
  schedulerExecutionLogController.getLogs,
);

router.get('/last', schedulerExecutionLogController.getLastLog);

router.get(
  '/:id',
  getSchedulerExecutionLogByIdValidator,
  validateRequest,
  schedulerExecutionLogController.getLogById,
);

export default router;
