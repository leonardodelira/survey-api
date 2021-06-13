import { ISurveyResultModel } from '@/domain/models/survey-result';

export interface ILoadSurveyResult {
  load(surveyId: string, accountId: string): Promise<ISurveyResultModel>;
}
