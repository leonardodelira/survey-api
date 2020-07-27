import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { serverError, unathorized, ok, badRequest } from '../../helpers/http/http-helpers';
import { IAuthentication } from '../../../domain/usecases/authentication';
import { IValidation } from '../../protocols/validation';

export class LoginController implements Controller {
  constructor(private readonly authentication: IAuthentication, private readonly validation: IValidation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);

      const { email, password } = httpRequest.body;
      const token = await this.authentication.auth({ email, password });

      if (!token) return unathorized();

      return ok({ acessToken: token });
    } catch (error) {
      return serverError(error);
    }
  }
}
