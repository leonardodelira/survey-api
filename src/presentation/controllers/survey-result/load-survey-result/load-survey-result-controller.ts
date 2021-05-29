import { ILoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http/http-helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: ILoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId);

    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }

    return null;
  }
}
