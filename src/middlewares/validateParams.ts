import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export function validateParams(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.sendError('Validation failed', 400, error.details);
    }

    req.params = value; // Sanitize req.params
    next();
  };
}
