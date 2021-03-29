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

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    class LoadSurveysStub implements ILoadSurveys {
      async load(): Promise<ISurveyModel[]> {
        return await new Promise(resolve => resolve(makeFakeSurveys()))
      }
    }
    const loadSurveysStub = new LoadSurveysStub()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    const sut = new LoadSurveysController(loadSurveysStub);
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled();
  })
})