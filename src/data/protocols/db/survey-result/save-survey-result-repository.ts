import { ISaveSurveyResultParams } from '../../../../domain/usecases/survey-result/save-survey-result';

export interface ISaveSurveyResultRepository {
  save(survey: ISaveSurveyResultParams): Promise<void>;
}
