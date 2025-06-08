// import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

import {
  createWebhook,
  getWebhookStatusService,
  getWebhookAttemptsService,
} from '../../services/webhook.service';

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

export const getWebhookStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const status = await getWebhookStatusService(id);
    if (!status) {
      console.log(`Job not found ${id}`);
      res.sendError('Job not found', 404);
      return;
    }

    res.sendSuccess(status, 200);
  } catch (error) {
    console.error('getWebhookStatusController catch Webhook error:', error);
    res.sendError('Internal server error', 400);
  }
};

export const getWebhookAttemptsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const attempts = await getWebhookAttemptsService(id);
    if (!attempts) {
      console.log(`Job attempts not found ${id}`);
      res.sendError('Job attempts not found', 404);
      return;
    }

    res.sendSuccess(attempts, 200);
  } catch (error) {
    console.error('getWebhookAttemptsController catch Webhook error:', error);
    res.sendError('Internal server error', 400);
  }
};
