import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export function validateBody(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.sendError('Validation failed', 400, error.details);
    }

    req.body = value; // Joi-safe payload replaces original body
    next();
  };
}
