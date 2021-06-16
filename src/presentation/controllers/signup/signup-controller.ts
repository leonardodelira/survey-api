import { HttpResponse, Controller } from '@/presentation/protocols';
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers/http/http-helpers';
import { IAddAccount } from '@/domain/usecases/account/add-account';
import { IValidation } from '@/presentation/protocols/validation';
import { IAuthentication } from '@/domain/usecases/account/authentication';
import { InvalidParamError } from '@/presentation/errors';

export class SignUpController implements Controller {
  constructor(private readonly addAccount: IAddAccount, private readonly validation: IValidation, private readonly authentication: IAuthentication) {}

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = request;

      const account = await this.addAccount.add({ name, email, password });

      if (account) {
        return ok(account);
      }

      return forbidden(new InvalidParamError('The received email is alredy in use'));
    } catch (err) {
      return serverError(err);
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string,
    email: string, 
    password: string,
  }
}