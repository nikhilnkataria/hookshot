import { v4 as uuidv4 } from 'uuid';

import db from '../configs/db';
import { WebhookInterface } from '../types/webhook';
import { webhookQueue } from '../queues/webhook';

export const createWebhook = async (data: WebhookInterface) => {
  const id = uuidv4();

  await db('webhooks').insert({
    id,
    target_url: data.target_url,
    payload: data.payload,
    headers: data.headers,
    meta: data.meta,
    retry_config: data.retry_config,
    status: 'pending',
  });

  const attempts = Math.min(Math.max(data.retry_config.max_attempts, 1), 5);

  await webhookQueue.add(
    'webhook-delivery',
    { id },
    {
      removeOnComplete: 100, // keep 100 successful completed job
      removeOnFail: { age: 86400 }, // keep job for 1 day
      jobId: id,
      attempts: attempts,
      backoff: {
        type: data.retry_config.backoff_strategy,
        delay: data.retry_config.initial_delay_ms || 1000, // initial delay in ms
      },
    }
  );

  return id;
};
