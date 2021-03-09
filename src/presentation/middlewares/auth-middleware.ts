import { ILoadAccountByToken } from '../../domain/usecases/load-account-by-token';
import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers/http/http-helpers';
import { HttpRequest, HttpResponse, IMiddleware } from '../protocols';

export class AuthMiddleware implements IMiddleware {
  constructor(
    private readonly loadAccountByToken: ILoadAccountByToken
  ) {

  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']

    if (accessToken) {
      await this.loadAccountByToken.load(httpRequest.headers['x-access-token']);
    }

    return forbidden(new AccessDeniedError());
  }
}