import { ISurveyResultModel } from '../../../../domain/models/survey-result';
import { ISaveSurveyResult, ISaveSurveyResultModel } from '../../../../domain/usecases/survey-result/save-survey-result';
import { ISaveSurveyResultRepository } from '../../../protocols/db/survey-result/save-survey-result-repository';

export class DbSaveSurveyResult implements ISaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: ISaveSurveyResultRepository
  ) { }

  async save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
    const saveResult = await this.saveSurveyResultRepository.save(data);
    return saveResult;
  }
}