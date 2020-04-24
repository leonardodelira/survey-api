import {
  HttpResponse,
  HttpRequest,
  Controller,
  IEmailValidator,
} from '../protocols';
import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helpers';

export class SignUpController implements Controller {
  private readonly emailValidator: IEmailValidator;

  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      if (httpRequest.body.password !== httpRequest.body.passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'));
      }
    } catch (err) {
      return serverError();
    }
  }
}
