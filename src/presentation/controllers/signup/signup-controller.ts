import { HttpResponse, HttpRequest, Controller } from '@/presentation/protocols';
import { badRequest, serverError, ok } from '@/presentation/helpers/http/http-helpers';
import { IAddAccount } from '@/domain/usecases/account/add-account';
import { IValidation } from '@/presentation/protocols/validation';
import { IAuthentication } from '@/domain/usecases/account/authentication';

export class SignUpController implements Controller {
  constructor(private readonly addAccount: IAddAccount, private readonly validation: IValidation, private readonly authentication: IAuthentication) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({ name, email, password });
      return ok(account);
    } catch (err) {
      return serverError(err);
    }
  }
}
