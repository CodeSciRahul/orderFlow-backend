import { Router } from 'express';

import { schedulerController } from '../../controllers';
import { schedulerAuth } from '../../middlewares/schedulerAuth';

const router = Router();

router.post(
  '/execute',
  schedulerAuth,
  schedulerController.execute,
);

export default router;
