import { HttpResponse, HttpRequest, Controller } from '../../protocols';
import { badRequest, serverError, ok } from '../../helpers/http/http-helpers';
import { IAddAccount } from '../../../domain/usecases/add-account';
import { IValidation } from '../../helpers/validators/validation';

export class SignUpController implements Controller {
  private readonly addAccount: IAddAccount;
  private readonly validation: IValidation;

  constructor(addAccount: IAddAccount, validation: IValidation) {
    this.addAccount = addAccount;
    this.validation = validation;
  }

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
