import { Controller, HttpRequest } from '../../presentation/protocols';
import { Request, Response } from 'express';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };

    const response = await controller.handle(httpRequest);
    res.status(response.statusCode).json(response.body);
  };
};
