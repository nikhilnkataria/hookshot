export type StandardSuccessResponse = {
  status: 'success';
  httpStatus: number;
  message: string;
  data: object | any[];
};

export type StandardErrorResponse = {
  status: 'error';
  httpStatus: number;
  message: string;
  data: object | any[];
};

// Extend Express's Response interface
declare module 'express-serve-static-core' {
  interface Response {
    sendSuccess: (
      data: object | any[],
      httpStatus?: number,
      message?: string
    ) => void;
    sendError: (
      message: string,
      httpStatus?: number,
      data?: object | any[]
    ) => void;
  }
}
