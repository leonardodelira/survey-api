import { IAddSurvey } from '../../../../domain/usecases/add-survey';
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helpers';
import { HttpResponse, HttpRequest, Controller, IValidation } from '../../../protocols';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly addSurvey: IAddSurvey
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { question, answers } = httpRequest.body;
      await this.addSurvey.add({
        question,
        answers
      });

      return noContent();
    } catch (err) {
      return serverError(err)
    }
  }
}
