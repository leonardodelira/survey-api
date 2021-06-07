import { ISurveyModel } from '@/domain/models/survey';
import { mockFakeSurveys } from '@/domain/test/mock-survey';
import { ILoadSurveys } from '@/domain/usecases/survey/load-surveys';

export const mockLoadSurveysStub = (): ILoadSurveys => {
  class LoadSurveysStub implements ILoadSurveys {
    async load(accountId: string): Promise<ISurveyModel[]> {
      return await Promise.resolve(mockFakeSurveys());
    }
  }

  return new LoadSurveysStub();
};
