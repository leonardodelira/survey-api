import { IAddSurveyModel } from '../../../../domain/usecases/survey/add-survey';

export interface IAddSurveyRepository {
  add(survey: IAddSurveyModel): Promise<void>;
}
