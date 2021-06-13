import { ISurveyResultModel } from '@/domain/models/survey-result';
import { mockFakeSurveyResult } from '@/domain/test';
import { ISaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { ILoadSurveyResultRepository } from '../protocols/db/survey-result/load-survey-result-repository';
import { ISaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository';

export const mockSaveSurveyResultRepository = (): ISaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements ISaveSurveyResultRepository {
    async save(survey: ISaveSurveyResultParams): Promise<void> {
      return Promise.resolve();
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

export const mockLoadSurveyResultRepositoryStub = () => {
  class LoadSurveyResultRepositoryStub implements ILoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string, accountId: string): Promise<ISurveyResultModel> {
      return Promise.resolve(mockFakeSurveyResult());
    }
  }
  return new LoadSurveyResultRepositoryStub();
};
