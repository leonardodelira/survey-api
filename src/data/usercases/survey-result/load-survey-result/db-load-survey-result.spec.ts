import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepositoryStub } from '@/data/test';
import { mockFakeSurveyResult, throwError } from '@/domain/test';
import { DbLoadSurveyResult } from './db-load-survey-result';
import { ILoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import mockDate from 'mockdate';

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  interface SutTypes {
    sut: DbLoadSurveyResult;
    loadSurveyResultRepositoryStub: ILoadSurveyResultRepository;
    loadSurveyByIdRepositoryStub: ILoadSurveyByIdRepository;
  }

  const makeSut = (): SutTypes => {
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepositoryStub();
    const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub);

    return {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub,
    };
  };

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    await sut.load('any_survey_id', 'any_account_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id');
  });

  test('Should throws if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError);

    const promisse = sut.load('any_survey_id', 'any_account_id');
    await expect(promisse).rejects.toThrow();
  });

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null));
    await sut.load('any_survey_id', 'any_account_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null));
    const response = await sut.load('any_survey_id', 'any_account_id');
    expect(response).toEqual(mockFakeSurveyResult());
  });

  test('Should return SurveyResultModel on success', async () => {
    const { sut } = makeSut();
    const response = await sut.load('any_survey_id', 'any_account_id');
    expect(response).toEqual(mockFakeSurveyResult());
  });
});
