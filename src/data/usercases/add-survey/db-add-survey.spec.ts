import { IAddSurveyModel } from '../../../domain/usecases/add-survey';
import { IAddSurveyRepository } from '../../protocols/db/survey/add-survey-repository';
import { DbAddSurvey } from './db-add-survey';

describe('DbAddSurvey UseCase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements IAddSurveyRepository {
      async add(survey: IAddSurveyModel): Promise<IAddSurveyModel> {
        const response = {
          ...survey
        }

        return await new Promise(resolve => resolve(response))
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
    const addSurveyRepositorySpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const sut = new DbAddSurvey(addSurveyRepositoryStub);

    await sut.add({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    })

    expect(addSurveyRepositorySpy).toHaveBeenCalledWith({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    })
  })
})