import { IAddSurvey, IAddSurveyModel } from '../../domain/usecases/survey/add-survey';

export const mockAddSurvey = (): IAddSurvey => {
  class AddSurveyStub implements IAddSurvey {
    async add(data: IAddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new AddSurveyStub();
}