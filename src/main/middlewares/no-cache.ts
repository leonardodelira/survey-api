import { Request, Response, NextFunction } from 'express';

export const noCache = (req: Request, res: Response, next: NextFunction): void => {
  res.header('cache-control', 'no-control, no-cache, must-revalidate, proxy-revalidate');
  res.header('pragma', 'no-cache');
  res.header('expires', '0');
  res.header('surrogate-control', 'no-store');
  next();
};
