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

/**
 * @swagger
 * /webhooks:
 *   post:
 *     summary: Register a new webhook
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - target_url
 *               - payload
 *               - retry_config
 *             properties:
 *               target_url:
 *                 type: string
 *                 format: uri
 *                 description: The URL where the webhook should be sent.
 *                 example: https://jsonplaceholder.typicode.com/posts
 *               payload:
 *                 type: object
 *                 description: The event name and data to be sent in the webhook.
 *                 required:
 *                   - data
 *                 properties:
 *                   event:
 *                     type: string
 *                     example: order.placed
 *                   data:
 *                     oneOf:
 *                       - type: object
 *                       - type: array
 *                     description: Arbitrary JSON payload for the event.
 *                     example:
 *                       order_id: ORD-1234
 *                       amount: 499
 *                       currency: INR
 *               headers:
 *                 type: object
 *                 description: Optional headers to send with the webhook. Must be string-to-string key-value pairs.
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   Content-Type: application/json
 *                   X-Custom-Header: example
 *               meta:
 *                 type: object
 *                 description: Optional metadata for internal tracking.
 *                 properties:
 *                   source:
 *                     type: string
 *                     example: checkout-service
 *                   project_id:
 *                     type: string
 *                     example: project-xyz789
 *               retry_config:
 *                 type: object
 *                 description: Retry strategy and configuration.
 *                 required:
 *                   - max_attempts
 *                   - initial_delay_ms
 *                   - backoff_strategy
 *                 properties:
 *                   max_attempts:
 *                     type: integer
 *                     example: 5
 *                   initial_delay_ms:
 *                     type: integer
 *                     description: Initial delay in milliseconds before the first retry.
 *                     example: 5000
 *                   backoff_strategy:
 *                     type: string
 *                     enum: [exponential, fixed, linear]
 *                     description: Retry delay strategy.
 *                     example: exponential
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       202:
 *         description: Webhook accepted for processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 httpStatus:
 *                   type: integer
 *                   example: 202
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: ca0be508-ccc0-41c2-a8e4-3089bffd038e
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 httpStatus:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                     - type: array
 *                   description: Error details returned by the system.
 *                   example:
 *                     - field: target_url
 *                       error: Must be a valid URL
 */
router.post('/', validateBody(webhookSchema), addWebhook);

/**
 * @swagger
 * /webhooks/{id}/status:
 *   get:
 *     summary: Get latest delivery status of a webhook
 *     tags: [Webhooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the webhook
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Latest status of the webhook
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 httpStatus:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     webhook_id:
 *                       type: string
 *                       format: uuid
 *                       example: ca0be508-ccc0-41c2-a8e4-3089bffd038e
 *                     latest_status:
 *                       type: string
 *                       enum: [pending, retrying, delivered, failed, dead]
 *                       example: delivered
 *                     last_attempt_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-08T09:56:24.078Z
 *       400:
 *         description: Invalid webhook ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 httpStatus:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "\"id\" must be a valid GUID"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["id"]
 *                       type:
 *                         type: string
 *                         example: string.guid
 *                       context:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             example: id
 *                           value:
 *                             type: string
 *                             example: ca0be508-ccc0-41c2-a8e4-asasd
 *                           key:
 *                             type: string
 *                             example: id
 *       404:
 *         description: Webhook job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 httpStatus:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Job not found
 *                 data:
 *                   type: object
 *                   example: {}
 */
router.get(
  '/:id/status',
  validateParams(jobIdParamSchema),
  getWebhookStatusController
);

/**
 * @swagger
 * /webhooks/{webhook_id}/attempts:
 *   get:
 *     summary: Get all delivery attempts for a given webhook
 *     tags: [Webhooks]
 *     parameters:
 *       - in: path
 *         name: webhook_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the webhook
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of delivery attempts for the given webhook
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 httpStatus:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 40e067bd-6a83-451c-8e7f-eb422d2fa54a
 *                       webhook_id:
 *                         type: string
 *                         format: uuid
 *                         example: ca0be508-ccc0-41c2-a8e4-3089bffd038e
 *                       attempt_number:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         enum: [pending, retrying, success, failed, dead]
 *                         example: success
 *                       response_code:
 *                         type: integer
 *                         example: 201
 *                       response_body:
 *                         type: object
 *                         example:
 *                           id: 101
 *                           data:
 *                             amount: 499
 *                             currency: INR
 *                             order_id: ORD-1234
 *                           event: order.placed
 *                       duration_ms:
 *                         type: integer
 *                         description: Time taken to complete the delivery (in ms)
 *                         example: 647
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-08T09:56:24.069Z
 *       400:
 *         description: Invalid webhook ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 httpStatus:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "\"webhook_id\" must be a valid GUID"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["webhook_id"]
 *                       type:
 *                         type: string
 *                         example: string.guid
 *                       context:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             example: webhook_id
 *                           value:
 *                             type: string
 *                             example: invalid-id
 *                           key:
 *                             type: string
 *                             example: webhook_id
 *       404:
 *         description: Webhook not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 httpStatus:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Webhook not found
 *                 data:
 *                   type: object
 *                   example: {}
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get(
  '/:id/attempts',
  validateParams(jobIdParamSchema),
  getWebhookAttemptsController
);

export default router;
