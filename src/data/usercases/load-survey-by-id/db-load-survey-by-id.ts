import { ISurveyModel } from '../../../domain/models/survey';
import { ILoadSurveyById } from '../../../domain/usecases/load-survey-by-id';
import { ILoadSurveyByIdRepository } from '../../protocols/db/survey/load-survey-by-id-repository';

export default class DbLoadSurveyById implements ILoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository
  ) { }

  async loadById(id: string): Promise<ISurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}