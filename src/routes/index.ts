import { Router } from 'express';
import { API_PREFIX } from '../constants';
import v1Routes from './v1';

const router = Router();

router.use(API_PREFIX, v1Routes);

export default router;
