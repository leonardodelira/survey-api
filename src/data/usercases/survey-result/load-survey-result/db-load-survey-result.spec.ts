import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { mockLoadSurveyResultRepositoryStub } from '@/data/test';
import { DbLoadSurveyResult } from './db-load-survey-result';

describe('DbLoadSurveyResult UseCase', () => {
  interface SutTypes {
    sut: DbLoadSurveyResult;
    loadSurveyResultRepositoryStub: ILoadSurveyResultRepository;
  }

  const makeSut = (): SutTypes => {
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepositoryStub();
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);

    return {
      sut,
      loadSurveyResultRepositoryStub,
    };
  };

  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    await sut.load('any_survey_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
