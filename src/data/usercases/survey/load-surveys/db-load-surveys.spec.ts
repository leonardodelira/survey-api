import { ILoadSurveyRepository } from '@/data/protocols/db/survey/load-survey-repository';
import DbLoadSurveys from './db-load-surveys';
import MockDate from 'mockdate';
import { throwError } from '@/domain/test';
import { mockLoadSurveyRepository } from '@/data/test';
import { mockFakeSurveys } from '@/domain/test/mock-survey';

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: ILoadSurveyRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveyRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

describe('DbLoadSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveyRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load('any_id');
    expect(loadAllSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should return a list of surveys on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.load('any_id');
    expect(httpResponse).toEqual(mockFakeSurveys());
  });

  test('Should throws if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError);
    const promisse = sut.load('any_id');
    await expect(promisse).rejects.toThrow();
  });
});
