import { Router, Request, Response } from 'express';

// import { webhookQueue } from '../../queues/webhook';
import { webhookSchema } from '../validators/webhook';
// import { WebhookInterface } from '../../types/webhook';
import { validateBody } from '../../middlewares/validateBody';
import { addWebhook } from '../controllers/webhook.controller';

const router = Router();

// router.post('/', validateBody(webhookSchema), (req, res) => {
//   let payload = req.body as WebhookInterface;
//   webhookQueue.add('webhook-delivery', payload);
//   res.sendSuccess({}, 202);
// });

router.post('/', validateBody(webhookSchema), addWebhook);

export default router;
