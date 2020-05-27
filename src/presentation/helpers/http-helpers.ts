import { HttpResponse } from '../protocols/http';
import { ServerError, UnathorizedError } from '../errors';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const unathorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnathorizedError(),
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});
