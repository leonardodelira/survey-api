import { Controller } from '@/presentation/protocols';
import { Request, Response } from 'express';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
      accountId: req.accountId,
    };

    const response = await controller.handle(request);
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      res.status(response.statusCode).json(response.body);
    } else {
      res.status(response.statusCode).json({
        error: response.body.message,
      });
    }
  };
};
