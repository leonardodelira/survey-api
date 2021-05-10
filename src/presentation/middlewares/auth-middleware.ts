import { ILoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers';
import { HttpRequest, HttpResponse, IMiddleware } from '@/presentation/protocols';

export class AuthMiddleware implements IMiddleware {
  constructor(
    private readonly loadAccountByToken: ILoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']

      if (accessToken) {
        const account = await this.loadAccountByToken.load(httpRequest.headers?.['x-access-token'], this.role);
        if (account) {
          return ok({ accountId: account.id })
        }
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error)
    }
  }
}