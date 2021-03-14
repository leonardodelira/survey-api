import { HttpRequest } from '../../presentation/protocols';
import { NextFunction, Request, Response } from 'express';
import { AuthMiddleware } from '../../presentation/middlewares/auth-middleware';

export const adaptMiddleware = (middleware: AuthMiddleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
    };

    const response = await middleware.handle(httpRequest);

    if (response.statusCode === 200) {
      Object.assign(req, httpRequest.body)
      next()
    } else {
      res.status(response.statusCode).json({
        error: response.body.message
      });
    }
  };
};
