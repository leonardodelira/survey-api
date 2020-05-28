import { HttpResponse, HttpRequest, Controller, IEmailValidator } from '../../protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError, ok } from '../../helpers/http-helpers';
import { IAddAccount } from '../../../domain/usecases/add-account';
import { IValidation } from '../../helpers/validators/validation';

export class SignUpController implements Controller {
  private readonly emailValidator: IEmailValidator;
  private readonly addAccount: IAddAccount;
  private readonly validation: IValidation;

  constructor(emailValidator: IEmailValidator, addAccount: IAddAccount, validation: IValidation) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body);
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirm } = httpRequest.body;

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'));
      }

      const account = await this.addAccount.add({ name, email, password });
      return ok(account);
    } catch (err) {
      return serverError(err);
    }
  }
}