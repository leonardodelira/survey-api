import { ISurveyResultModel } from "@/domain/models/survey-result";
import {
  ISaveSurveyResult,
  ISaveSurveyResultParams,
} from "@/domain/usecases/survey-result/save-survey-result";
import { ISaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";

export class DbSaveSurveyResult implements ISaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: ISaveSurveyResultRepository
  ) {}

  async save(data: ISaveSurveyResultParams): Promise<ISurveyResultModel> {
    const saveResult = await this.saveSurveyResultRepository.save(data);
    return saveResult;
  }
}
