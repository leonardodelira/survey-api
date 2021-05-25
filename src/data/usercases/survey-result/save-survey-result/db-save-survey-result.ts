import { ISurveyResultModel } from '@/domain/models/survey-result';
import { ISaveSurveyResult, ISaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';

export class DbSaveSurveyResult implements ISaveSurveyResult {
  constructor(private readonly saveSurveyResultRepository: ISaveSurveyResultRepository, private readonly loadSurveyResultRepository: ILoadSurveyResultRepository) {}

  async save(data: ISaveSurveyResultParams): Promise<ISurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);
    const result = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId);
    return result;
  }
}
