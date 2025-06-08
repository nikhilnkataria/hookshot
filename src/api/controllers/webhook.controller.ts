// import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

import { createWebhook } from '../../services/webhook.service';
// import db from '../../configs/db';
// import { WebhookInterface } from '../../types/webhook';
// import { webhookQueue } from '../../queues/webhook';

export const addWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = await createWebhook(req.body);
    res.sendSuccess({ id }, 202);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendError('Internal server error', 400);
  }
};
