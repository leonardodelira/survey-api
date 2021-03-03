import { badRequest } from '../../../helpers/http/http-helpers';
import { HttpResponse, HttpRequest, Controller, IValidation } from '../../../protocols';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: IValidation
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);
    if (error) {
      return badRequest(error);
    }
    return await new Promise(resolve => resolve(null))
  }
}
