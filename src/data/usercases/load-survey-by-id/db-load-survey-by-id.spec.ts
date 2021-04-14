import { ISurveyModel } from '../../../domain/models/survey';
import { ILoadSurveyByIdRepository } from '../../protocols/db/survey/load-survey-by-id-repository';
import DbLoadSurveyById from './db-load-survey-by-id';

const makeFakeSurvey = (): ISurveyModel => {
  const survey = {
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }

  return survey;
}

const makeLoadSurveyByIdRepository = (): ILoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements ILoadSurveyByIdRepository {
    async loadById(id: string): Promise<ISurveyModel> {
      return await new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }

  return new LoadSurveyByIdRepositoryStub();
}

interface SutTypes {
  sut: DbLoadSurveyById,
  loadSurveyByIdRepositoryStub: ILoadSurveyByIdRepository,
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

  return {
    sut,
    loadSurveyByIdRepositoryStub,
  }
}

describe('DbLoadSurveyById', () => {
  test('Should call LoadSurveyByRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('fakeid')
    expect(loadByIdSpy).toHaveBeenCalledWith('fakeid')
  })
})