import { Controller, HttpResponse } from '@/presentation/protocols';
import { serverError, unathorized, ok, badRequest } from '@/presentation/helpers/http/http-helpers';
import { IAuthentication } from '@/presentation/../domain/usecases/account/authentication';
import { IValidation } from '@/presentation/protocols/validation';

export class LoginController implements Controller {
  constructor(private readonly authentication: IAuthentication, private readonly validation: IValidation) {}

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) return badRequest(error);

      const { email, password } = request;
      const authenticated = await this.authentication.auth({ email, password });

      if (!authenticated) return unathorized();

      return ok(authenticated);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string, 
    password: string,
  }
}