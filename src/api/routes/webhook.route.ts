import { Router, Request, Response } from 'express';

import { webhookSchema, jobIdParamSchema } from '../validators/webhook';
import { validateBody } from '../../middlewares/validateBody';
import { validateParams } from '../../middlewares/validateParams';
import {
  addWebhook,
  getWebhookStatusController,
  getWebhookAttemptsController,
} from '../controllers/webhook.controller';

const router = Router();

router.post('/', validateBody(webhookSchema), addWebhook);

router.get(
  '/:id/status',
  validateParams(jobIdParamSchema),
  getWebhookStatusController
);

router.get(
  '/:id/attempts',
  validateParams(jobIdParamSchema),
  getWebhookAttemptsController
);

export default router;
