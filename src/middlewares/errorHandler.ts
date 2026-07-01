import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { HTTP_STATUS, MESSAGES } from '../constants';
import { env } from '../config';
import { AppError } from '../utils';
import { ResponseHelper } from '../utils';

export const validateRequest = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: 'path' in error ? String(error.path) : 'unknown',
      message: error.msg,
    }));

    throw new AppError(
      MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      true,
      formattedErrors,
    );
  }

  next();
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      HTTP_STATUS.NOT_FOUND,
    ),
  );
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json(ResponseHelper.error(err.message, err.errors));
    return;
  }

  if (err.name === 'CastError') {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(ResponseHelper.error('Invalid resource identifier'));
    return;
  }

  if (err.name === 'ValidationError') {
    res
      .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      .json(ResponseHelper.error(MESSAGES.VALIDATION_ERROR));
    return;
  }

  if (err.name === 'MongoServerError' && 'code' in err && err.code === 11000) {
    res
      .status(HTTP_STATUS.CONFLICT)
      .json(ResponseHelper.error('Duplicate entry detected'));
    return;
  }

  console.error('[Error]', err);

  const response = ResponseHelper.error(
    env.isProduction ? MESSAGES.INTERNAL_ERROR : err.message,
  );

  if (!env.isProduction && err.stack) {
    response.stack = err.stack;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};
