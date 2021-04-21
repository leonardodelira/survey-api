import { ISurveyModel } from '../../../domain/models/survey';
import { ILoadSurveyRepository } from '../../protocols/db/survey/load-survey-repository';
import DbLoadSurveys from './db-load-surveys';
import MockDate from 'mockdate'

const makeFakeSurveys = (): ISurveyModel[] => {
  const surveys = [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
  ]

  return surveys;
}

const makeAddSurveyRepository = (): ILoadSurveyRepository => {
  class LoadSurveysRepositoryStub implements ILoadSurveyRepository {
    async loadAll(): Promise<ISurveyModel[]> {
      return await new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }

  return new LoadSurveysRepositoryStub();
}

interface SutTypes {
  sut: DbLoadSurveys,
  loadSurveysRepositoryStub: ILoadSurveyRepository,
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeAddSurveyRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return {
    sut,
    loadSurveysRepositoryStub,
  }
}

describe('DbLoadSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return a list of surveys on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.load()
    expect(httpResponse).toEqual(makeFakeSurveys())
  })

  test('Should throws if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promisse = sut.load();
    await expect(promisse).rejects.toThrow();
  });
})