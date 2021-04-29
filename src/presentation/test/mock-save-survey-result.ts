import { ISurveyResultModel } from '../../domain/models/survey-result';
import { mockFakeSurveyResult } from '../../domain/test';
import { ISaveSurveyResult, ISaveSurveyResultModel } from '../../domain/usecases/survey-result/save-survey-result';

export const mockSaveSurveyResult = (): ISaveSurveyResult => {
  class SaveSurveyResultStub implements ISaveSurveyResult {
    async save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
      return await new Promise(resolve => resolve(mockFakeSurveyResult()))
    }
  }

  return new SaveSurveyResultStub();
}