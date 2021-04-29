import { ISurveyResultModel } from '../../domain/models/survey-result';
import { mockFakeSurveyResult } from '../../domain/test';
import { ISaveSurveyResultModel } from '../../domain/usecases/survey-result/save-survey-result';
import { ISaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository';

export const mockSaveSurveyResultRepository = (): ISaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements ISaveSurveyResultRepository {
    async save(survey: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
      return await new Promise(resolve => resolve(mockFakeSurveyResult()))
    }
  }

  return new SaveSurveyResultRepositoryStub();
}
