import { ISaveSurveyResultParams } from '../../../../domain/usecases/survey-result/save-survey-result';

export interface ISaveSurveyResultRepository {
  save(survey: ISaveSurveyResultRepository.Params): Promise<void>;
}

export namespace ISaveSurveyResultRepository {
  export type Params = ISaveSurveyResultParams;
}
