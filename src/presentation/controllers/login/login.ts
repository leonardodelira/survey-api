import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { serverError, unathorized, ok, badRequest } from '../../helpers/http/http-helpers';
import { IAuthentication } from '../../../domain/usecases/authentication';
import { IValidation } from '../../helpers/validators/validation';

export class LoginController implements Controller {
  private readonly authentication: IAuthentication;
  private readonly validation: IValidation;

  constructor(authentication: IAuthentication, validation: IValidation) {
    this.authentication = authentication;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);

      const { email, password } = httpRequest.body;
      const token = await this.authentication.auth(email, password);

      if (!token) return unathorized();

      return ok({ acessToken: token });
    } catch (error) {
      return serverError(error);
    }
  }
}
