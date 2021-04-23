import { DbSaveSurveyResult } from '../../../../../data/usercases/survey-result/save-survey-result/db-save-survey-result';
import { ISaveSurveyResult } from '../../../../../domain/usecases/survey-result/save-survey-result';
import { SurveyResultMongoRepository } from '../../../../../infra/db/mongodb/survey-result/survey-result-mongo-repository';

export const makeDbASaveSurveyResult = (): ISaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(surveyResultMongoRepository);
};
