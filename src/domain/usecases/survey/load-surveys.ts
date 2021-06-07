import { ISurveyModel } from '@/domain/models/survey';

export interface ILoadSurveys {
  load(accountId: string): Promise<ISurveyModel[]>;
}
