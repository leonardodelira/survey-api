import { ISurveyModel } from '../../../../domain/models/survey';

export interface ILoadSurveyRepository {
  loadAll(accountId: string): Promise<ISurveyModel[]>;
}
