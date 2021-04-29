import { ILoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository';
import DbLoadSurveyById from './db-load-survey-by-id';
import MockDate from 'mockdate'
import { throwError } from '../../../../domain/test';
import { mockLoadSurveyByIdRepository } from '../../../test';
import { mockFakeSurvey } from '../../../../domain/test/mock-survey';

interface SutTypes {
  sut: DbLoadSurveyById,
  loadSurveyByIdRepositoryStub: ILoadSurveyByIdRepository,
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

  return {
    sut,
    loadSurveyByIdRepositoryStub,
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('fakeid')
    expect(loadByIdSpy).toHaveBeenCalledWith('fakeid')
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.loadById('any_id')
    expect(httpResponse).toEqual(mockFakeSurvey())
  })

  test('Should throws if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError);
    const promisse = sut.loadById('any_id')
    await expect(promisse).rejects.toThrow();
  })
})