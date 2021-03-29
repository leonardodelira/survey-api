import { ISurveyModel } from '../../../domain/models/survey';
import { ILoadSurveys } from '../../../domain/usecases/load-surveys';
import { ILoadSurveyRepository } from '../../protocols/db/survey/load-survey-repository';

export default class DbLoadSurveys implements ILoadSurveys {
  constructor(
    private readonly loadSurveysRepository: ILoadSurveyRepository
  ) { }

  async load(): Promise<ISurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll();
    return surveys
  }
}