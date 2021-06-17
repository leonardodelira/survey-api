import { ILoadSurveys } from '@/domain/usecases/survey/load-surveys';

export interface ILoadSurveyRepository {
  loadAll(accountId: string): Promise<ILoadSurveyRepository.Result>;
}

export namespace ILoadSurveyRepository {
  export type Result = ILoadSurveys.Result;
}
