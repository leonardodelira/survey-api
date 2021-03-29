import { ISurveyModel } from '../../../../domain/models/survey'
import { ILoadSurveys } from '../../../../domain/usecases/load-surveys'
import LoadSurveysController from './load-surveys-controller';
import MockDate from 'mockdate';

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

const makeLoadSurveysStub = (): ILoadSurveys => {
  class LoadSurveysStub implements ILoadSurveys {
    async load(): Promise<ISurveyModel[]> {
      return await new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }

  return new LoadSurveysStub()
}

interface SutTypes {
  loadSurveysStub: ILoadSurveys;
  sut: LoadSurveysController;
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub();
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
    expect(loadSpy).toHaveBeenCalled();
  })
})