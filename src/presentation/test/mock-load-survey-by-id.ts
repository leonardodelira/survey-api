import { ISurveyModel } from '../../domain/models/survey';
import { mockFakeSurvey } from '../../domain/test/mock-survey';
import { ILoadSurveyById } from '../../domain/usecases/survey/load-survey-by-id';

export const mockLoadSurveyById = (): ILoadSurveyById => {
  class LoadSurveyByIdStub implements ILoadSurveyById {
    async loadById(id: string): Promise<ISurveyModel> {
      return await Promise.resolve(mockFakeSurvey())
    }
  }

  return new LoadSurveyByIdStub();
}