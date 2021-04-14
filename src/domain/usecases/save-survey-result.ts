import { ISurveyResultModel } from '../models/survey-result';

export type ISaveSurveyModel = Omit<ISurveyResultModel, 'id'>

export interface ISaveSurveyResult {
  save(data: ISaveSurveyModel): Promise<ISurveyResultModel>;
}
