import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: any;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  
  // Specific handling for MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: `Duplicate field value: ${JSON.stringify(err.keyValue)}`,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  }

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
