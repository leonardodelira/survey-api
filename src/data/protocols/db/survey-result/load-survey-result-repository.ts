import { ISurveyResultModel } from '@/domain/models/survey-result';

export interface ILoadSurveyResultRepository {
  loadBySurveyId(surveyId: string, accountId: string): Promise<ILoadSurveyResultRepository.Result>;
}

export namespace ILoadSurveyResultRepository {
  export type Result = ISurveyResultModel;
}
