import { Request, Response, NextFunction } from 'express';
import {
  StandardSuccessResponse,
  StandardErrorResponse,
} from '../types/standardResponse';

export function standardResponse(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.sendSuccess = (data = {}, httpStatus = 200, message = 'OK'): void => {
    const response: StandardSuccessResponse = {
      status: 'success',
      httpStatus,
      message,
      data: Array.isArray(data) ? data : { ...data },
    };
    res.status(httpStatus).json(response);
  };

  res.sendError = (
    message = 'Something went wrong',
    httpStatus = 500,
    data = {}
  ): void => {
    const response: StandardErrorResponse = {
      status: 'error',
      httpStatus,
      message,
      data: Array.isArray(data) ? data : { ...data },
    };
    res.status(httpStatus).json(response);
  };

  next();
}
