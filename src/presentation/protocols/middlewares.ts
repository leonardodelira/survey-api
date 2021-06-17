import { HttpResponse } from './http';

export interface IMiddleware {
  handle(httpRequest): Promise<HttpResponse>;
}
