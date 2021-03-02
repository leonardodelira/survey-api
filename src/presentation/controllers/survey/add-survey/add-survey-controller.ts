import { HttpResponse, HttpRequest, Controller, IValidation } from '../../../protocols';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: IValidation
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);
    return await new Promise(resolve => resolve(null))
  }
}
