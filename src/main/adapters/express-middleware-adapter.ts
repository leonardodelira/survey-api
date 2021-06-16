import { NextFunction, Request, Response } from 'express';
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';

export const adaptMiddleware = (middleware: AuthMiddleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request: any = {
      accessToken: req.headers?.['x-access-token'],
      ...(req.headers || {}),
    };

    const response = await middleware.handle(request);

    if (response.statusCode === 200) {
      Object.assign(req, request.body);
      next();
    } else {
      res.status(response.statusCode).json({
        error: response.body.message,
      });
    }
  };
};
