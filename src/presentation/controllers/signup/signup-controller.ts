import { HttpResponse, HttpRequest, Controller } from '../../protocols';
import { badRequest, serverError, ok } from '../../helpers/http/http-helpers';
import { IAddAccount } from '../../../domain/usecases/add-account';
import { IValidation } from '../../protocols/validation';

export class SignUpController implements Controller {
  constructor(private readonly addAccount: IAddAccount, private readonly validation: IValidation) {}

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
