import { ISurveyModel } from '../../models/survey';

export interface ILoadSurveyById {
  loadById(id: string): Promise<ISurveyModel>;
}
