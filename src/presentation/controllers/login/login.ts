import { Controller, HttpRequest, HttpResponse, IEmailValidator } from '../../protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError, unathorized, ok } from '../../helpers/http-helpers';
import { IAuthentication } from '../../../domain/usecases/authentication';

export class LoginController implements Controller {
  private readonly emailValidator: IEmailValidator;
  private readonly authentication: IAuthentication;
  
  constructor(emailValidator: IEmailValidator, authentication: IAuthentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password } = httpRequest.body; 

      const isValid = this.emailValidator.isValid(email);

      if(!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      
      const token = await this.authentication.auth(email, password);

      if(!token)
        return unathorized();

      return ok({acessToken: token});
    } catch (error){
      return serverError(error)
    }
  }
}