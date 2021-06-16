import { ILoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { ILoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: ILoadSurveyById, private readonly loadSurveyResult: ILoadSurveyResult) {}

  async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId } = request;
      const survey = await this.loadSurveyById.loadById(surveyId);

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyResult = await this.loadSurveyResult.load(surveyId, request.accountId);

      return ok(surveyResult);
    } catch (err) {
      return serverError(err);
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string, 
    accountId: string,
  }
}