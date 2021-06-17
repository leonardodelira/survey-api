import { IAddSurvey } from '@/domain/usecases/survey/add-survey';
import { IAddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';

export class DbAddSurvey implements IAddSurvey {
  constructor(private readonly addSurveyRepository: IAddSurveyRepository) {}

  async add(data: IAddSurvey.Params): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
