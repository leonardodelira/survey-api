import { ILoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { ILoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';

export default class DbLoadSurveyById implements ILoadSurveyById {
  constructor(private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository) {}

  async loadById(id: string): Promise<ILoadSurveyById.Result> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}
