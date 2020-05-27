import { Controller, HttpRequest, HttpResponse, IEmailValidator } from '../../protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helpers';

export class LoginController implements Controller {
  private readonly emailValidator: IEmailValidator;
  
  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email } = httpRequest.body; 

      const isValid = this.emailValidator.isValid(email);

      if(!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      
      return await new Promise(resolve => resolve(null));
    } catch (error){
      return serverError(error)
    }
  }
}