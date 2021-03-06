import { IAddSurveyModel } from '../../../../domain/usecases/add-survey';

export interface IAddSurveyRepository {
  add(survey: IAddSurveyModel): Promise<void>;
}
