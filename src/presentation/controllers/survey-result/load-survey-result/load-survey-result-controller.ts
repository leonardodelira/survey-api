import { ILoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { ILoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers/http/http-helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: ILoadSurveyById, private readonly loadSurveyResult: ILoadSurveyResult) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const survey = await this.loadSurveyById.loadById(surveyId);

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      await this.loadSurveyResult.load(surveyId);

      return null;
    } catch (err) {
      return serverError(err);
    }
  }
}
