import { ISaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result';
import { ILoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: ILoadSurveyById,
    private readonly saveSurveyResult: ISaveSurveyResult
  ) { }

  async handle(request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request;
      const survey = await this.loadSurveyById.loadById(surveyId);

      if (survey) {
        const answers = survey.answers.map(a => a.answer);
        
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }

        const surveyResult = await this.saveSurveyResult.save({
          accountId,
          surveyId,
          answer,
          date: new Date()
        });

        return ok(surveyResult);
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }
    } catch (err) {
      return serverError(err);
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string,
    answer: string, 
    accountId: string,
  }
}