import { IAddSurvey, IAddSurveyModel } from '../../../domain/usecases/add-survey';
import { IAddSurveyRepository } from '../../protocols/db/survey/add-survey-repository';

export class DbAddSurvey implements IAddSurvey {
  constructor(
    private readonly addSurveyRepository: IAddSurveyRepository
  ) { }

  async add(data: IAddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(data);
    return await new Promise(resolve => resolve())
  }
}