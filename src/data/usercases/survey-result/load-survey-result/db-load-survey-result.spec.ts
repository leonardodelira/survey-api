import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { ISurveyResultModel } from '@/domain/models/survey-result';
import { mockFakeSurveyResult } from '@/domain/test';
import { ILoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { DbLoadSurveyResult } from './db-load-survey-result';

describe('DbLoadSurveyResult UseCase', () => {
  class LoadSurveyResultRepositoryStub implements ILoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<ISurveyResultModel> {
      return Promise.resolve(mockFakeSurveyResult());
    }
  }
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub();

  test('Should call LoadSurveyResultRepository', async () => {
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    await sut.load('any_survey_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
