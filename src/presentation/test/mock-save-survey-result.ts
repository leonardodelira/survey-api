import { ISurveyResultModel } from '@/domain/models/survey-result';
import { mockFakeSurveyResult } from '@/domain/test';
import { ILoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { ISaveSurveyResult, ISaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';

export const mockSaveSurveyResult = (): ISaveSurveyResult => {
  class SaveSurveyResultStub implements ISaveSurveyResult {
    async save(data: ISaveSurveyResultParams): Promise<ISurveyResultModel> {
      return await Promise.resolve(mockFakeSurveyResult());
    }
  }

  return new SaveSurveyResultStub();
};

export const mockLoadSurveyResult = (): ILoadSurveyResult => {
  class LoadSurveyResultStub implements ILoadSurveyResult {
    async load(surveyId: string): Promise<ISurveyResultModel> {
      return await Promise.resolve(mockFakeSurveyResult());
    }
  }

  return new LoadSurveyResultStub();
};
