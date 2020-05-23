import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helpers';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    return await new Promise(resolve => resolve(null));
  }
}