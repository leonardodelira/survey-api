import { ISurveyModel } from '../../../../domain/models/survey'
import { ILoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id'
import MockDate from 'mockdate'
import { HttpRequest } from '../../../protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { forbidden, serverError } from '../../../helpers/http/http-helpers'
import { InvalidParamError } from '../../../errors'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

const makeFakeSurvey = (): ISurveyModel => ({
  id: 'any_id',
  question: 'any_qustion',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image'
    }
  ],
  date: new Date()
});

const makeLoadSurveyById = (): ILoadSurveyById => {
  class LoadSurveyByIdStub implements ILoadSurveyById {
    async loadById(id: string): Promise<ISurveyModel> {
      return await new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }

  return new LoadSurveyByIdStub();
}

interface SutTypes {
  sut: SaveSurveyResultController,
  loadSurveyByIdStub: ILoadSurveyById,
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);

  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(makeFakeRequest());
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)));
    const hhtpResponse = await sut.handle(makeFakeRequest());
    expect(hhtpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const hhtpResponse = await sut.handle(makeFakeRequest());
    expect(hhtpResponse).toEqual(serverError(new Error()))
  })
})