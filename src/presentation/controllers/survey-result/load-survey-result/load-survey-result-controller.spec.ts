import { ILoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { HttpRequest } from '@/presentation/protocols';
import { mockLoadSurveyById } from '@/presentation/test';
import { LoadSurveyResultController } from './load-survey-result-controller';

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id',
  },
});

interface SutTypes {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: ILoadSurveyById;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub);

  return {
    sut,
    loadSurveyByIdStub,
  };
};

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadSurveySpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(makeFakeRequest());
    expect(loadSurveySpy).toHaveBeenCalledWith('any_id');
  });
});
