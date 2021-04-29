import { noContent, ok, serverError } from '../../../helpers/http/http-helpers';
import { ILoadSurveys } from '../../../../domain/usecases/survey/load-surveys';
import { throwError } from '../../../../domain/test';
import { mockFakeSurveys } from '../../../../domain/test/mock-survey';
import { mockLoadSurveysStub } from '../../../test';
import LoadSurveysController from './load-surveys-controller';
import MockDate from 'mockdate';

interface SutTypes {
  loadSurveysStub: ILoadSurveys;
  sut: LoadSurveysController;
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveysStub();
  const sut = new LoadSurveysController(loadSurveysStub);

  return {
    loadSurveysStub,
    sut
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    const { loadSurveysStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockFakeSurveys()))
  })

  test('Should return 204 if LoadSurveys return empty', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })


  test('Should return 500 if LoadSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})