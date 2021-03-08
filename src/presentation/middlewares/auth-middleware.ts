import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers/http/http-helpers';
import { HttpRequest, HttpResponse, IMiddleware } from '../protocols';

export class AuthMiddleware implements IMiddleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = forbidden(new AccessDeniedError());
    return await new Promise((resolve) => resolve(error))
  }
}