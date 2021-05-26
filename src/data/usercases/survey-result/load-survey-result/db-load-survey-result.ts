import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { ILoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { ISurveyResultModel } from '@/domain/models/survey-result';
import { ILoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';

export class DbLoadSurveyResult implements ILoadSurveyResult {
  constructor(private readonly loadSurveyResultRepository: ILoadSurveyResultRepository, private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository) {}

  async load(surveyId: string): Promise<ISurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId);
    }
    return surveyResult;
  }
}
