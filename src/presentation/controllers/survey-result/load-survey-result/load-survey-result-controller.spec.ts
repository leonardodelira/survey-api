import { ILoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { ILoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers/http/http-helpers';
import { HttpRequest } from '@/presentation/protocols';
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test';
import { LoadSurveyResultController } from './load-survey-result-controller';

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id',
  },
});

interface SutTypes {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: ILoadSurveyById;
  loadSurveyResultStub: ILoadSurveyResult;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub);

  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub,
  };
};

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadSurveySpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(makeFakeRequest());
    expect(loadSurveySpy).toHaveBeenCalledWith('any_id');
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    const loadSurveySpy = jest.spyOn(loadSurveyResultStub, 'load');
    await sut.handle(makeFakeRequest());
    expect(loadSurveySpy).toHaveBeenCalledWith('any_id');
  });
});
