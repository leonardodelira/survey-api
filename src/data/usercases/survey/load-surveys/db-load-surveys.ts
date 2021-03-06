import { ILoadSurveys } from '@/domain/usecases/survey/load-surveys';
import { ILoadSurveyRepository } from '@/data/protocols/db/survey/load-survey-repository';

export default class DbLoadSurveys implements ILoadSurveys {
  constructor(private readonly loadSurveysRepository: ILoadSurveyRepository) {}

  async load(accountId: string): Promise<ILoadSurveys.Result> {
    const surveys = await this.loadSurveysRepository.loadAll(accountId);
    return surveys;
  }
}
