import { ISurveyResultModel } from '@/domain/models/survey-result';

export type ISaveSurveyResultModel = Omit<ISurveyResultModel, 'id'>

export interface ISaveSurveyResult {
  save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel>;
}
