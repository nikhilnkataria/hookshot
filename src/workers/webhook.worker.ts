import { Worker, Job } from 'bullmq';
import axios, { AxiosError } from 'axios';

import db from '../configs/db';
import { redisConnection } from '../configs/redis';
import { webhookDLQueue } from '../queues/webhook.dlq';
import { DLQ_QUEUE_NAME, RETRY_QUEUE_NAME } from '../configs/constants';

export function startWebHookWorker() {
  const worker = new Worker(
    RETRY_QUEUE_NAME,
    async (job: Job) => {
      const { id } = job.data;

      const webhook = await db('webhooks').where({ id }).first();
      if (!webhook) throw new Error(`Webhook not found for id ${id}`);

      const attemptNumber = job.attemptsMade + 1;
      const start = Date.now();

      try {
        const response = await axios.post(webhook.target_url, webhook.payload, {
          headers: webhook.headers || {},
          timeout: 5000,
        });

        const duration = Date.now() - start;

        await db('webhook_attempts').insert({
          webhook_id: id,
          attempt_number: attemptNumber,
          status: 'success',
          response_code: response.status,
          response_body: response.data,
          duration_ms: duration,
        });

        await db('webhooks')
          .update({
            status: 'delivered',
            updated_at: new Date(),
          })
          .where({ id });
      } catch (err) {
        const duration = Date.now() - start;

        let response_code = null;
        let response_body = { message: 'Unknown error' };
        let logMessage = '';
        const attemptInfo = `Webhook ID: ${id} | Attempt: ${attemptNumber}`;

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError;
          response_code = err.response?.status || null;
          response_body = err.response?.data || { message: err.message };

          logMessage = [
            `❌ AxiosError during webhook call`,
            `  ${attemptInfo}`,
            `  Target URL: ${axiosErr.config?.url}`,
            `  Code: ${axiosErr.code || 'N/A'}`,
            `  Message: ${axiosErr.message}`,
          ].join('\n');
        } else if (err instanceof Error) {
          response_body = { message: err.message };

          logMessage = [
            `❌ Error during webhook call`,
            `  ${attemptInfo}`,
            `  Message: ${err.message}`,
          ].join('\n');
        }

        console.error(logMessage);

        await db('webhook_attempts').insert({
          webhook_id: id,
          attempt_number: attemptNumber,
          status: 'failed',
          response_code,
          response_body,
          duration_ms: duration,
        });

        const isFinalAttempt = attemptNumber >= job.opts.attempts!;
        if (isFinalAttempt) {
          await db('webhooks')
            .update({
              status: 'dead',
              updated_at: new Date(),
            })
            .where({ id });

          console.warn(`☠️ Webhook marked as DEAD after final attempt: ${id}`);

          // Optional: push to DLQ queue
          // await dlqQueue.add('webhook-dead', { id });
          await webhookDLQueue.add(DLQ_QUEUE_NAME, { id }, { jobId: id });
        }

        throw err; // Let BullMQ handle retry
      }
    },
    {
      connection: redisConnection,
    }
  );

  worker.on('ready', () => console.log(`✅ Worker initiated`));

  worker.on('completed', (job: Job) => {
    console.log(`✅ Completed: id=${job.id}, name=${job.name}`);
  });

  worker.on('failed', (job: Job | undefined, err) => {
    console.error(
      `❌ Failed: id=${job?.id}, name=${job?.name}, attempt=${job?.attemptsMade}`,
      err.message
    );
  });
}
