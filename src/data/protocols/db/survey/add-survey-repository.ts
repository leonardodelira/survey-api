import { IAddSurvey } from '../../../../domain/usecases/survey/add-survey';

export interface IAddSurveyRepository {
  add(survey: IAddSurveyRepository.Params): Promise<void>;
}

export namespace IAddSurveyRepository {
  export type Params = IAddSurvey.Params;
}
