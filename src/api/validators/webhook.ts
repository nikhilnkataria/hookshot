import Joi from 'joi';

export const webhookSchema = Joi.object({
  target_url: Joi.string().uri().required(),
  payload: Joi.object({
    event: Joi.string().required(),
    data: Joi.alternatives().try(Joi.object(), Joi.array()).required(),
  }).required(),
  headers: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  meta: Joi.object({
    source: Joi.string().required(),
    project_id: Joi.string().required(),
  }).optional(),
  retry_config: Joi.object({
    max_attempts: Joi.number().integer().required(),
    initial_delay_ms: Joi.number().integer().required(),
    backoff_strategy: Joi.string()
      .valid('exponential', 'fixed', 'linear')
      .required(),
  }).required(),
});

export const jobIdParamSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).required(),
});
