import { ISaveSurveyResult, ISaveSurveyResultModel } from '../../../../domain/usecases/survey-result/save-survey-result';
import { ILoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '../../../errors';
import { forbidden, serverError } from '../../../helpers/http/http-helpers';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: ILoadSurveyById,
    private readonly saveSurveyResult: ISaveSurveyResult
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (survey) {
        const answers = survey.answers.map(a => a.answer);
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }

        const surveyResult: ISaveSurveyResultModel = {
          accountId: httpRequest.accountId,
          surveyId,
          answer,
          date: new Date()
        }
        await this.saveSurveyResult.save(surveyResult);
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }

      return null;
    } catch (err) {
      return serverError(err);
    }
  }
}