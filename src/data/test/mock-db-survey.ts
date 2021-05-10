import { ISurveyModel } from '@/domain/models/survey';
import { mockFakeSurvey, mockFakeSurveys } from '@/domain/test/mock-survey';
import { IAddSurveyModel } from '@/domain/usecases/survey/add-survey';
import { IAddSurveyRepository } from '../protocols/db/survey/add-survey-repository';
import { ILoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository';
import { ILoadSurveyRepository } from '../protocols/db/survey/load-survey-repository';

export const mockAddSurveyRepository = (): IAddSurveyRepository => {
  class AddSurveyRepositoryStub implements IAddSurveyRepository {
    async add(survey: IAddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddSurveyRepositoryStub();
}

export const mockLoadSurveyByIdRepository = (): ILoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements ILoadSurveyByIdRepository {
    async loadById(id: string): Promise<ISurveyModel> {
      return await Promise.resolve(mockFakeSurvey())
    }
  }

  return new LoadSurveyByIdRepositoryStub();
}

export const mockLoadSurveyRepository = (): ILoadSurveyRepository => {
  class LoadSurveysRepositoryStub implements ILoadSurveyRepository {
    async loadAll(): Promise<ISurveyModel[]> {
      return await Promise.resolve(mockFakeSurveys())
    }
  }

  return new LoadSurveysRepositoryStub();
}