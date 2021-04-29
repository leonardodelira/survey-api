import { IAddSurveyRepository } from '../../../protocols/db/survey/add-survey-repository';
import { DbAddSurvey } from './db-add-survey';
import { IAddSurveyModel } from '../../../../domain/usecases/survey/add-survey';
import { throwError } from '../../../../domain/test';
import { mockAddSurveyRepository } from '../../../test';
import MockDate from 'mockdate'

const makeFakeSurveyData = (): IAddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

interface SutTypes {
  sut: DbAddSurvey,
  addSurveyRepositoryStub: IAddSurveyRepository,
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = makeFakeSurveyData();
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throws if AddAccountRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError);

    const promisse = sut.add(makeFakeSurveyData());
    await expect(promisse).rejects.toThrow();
  });
})