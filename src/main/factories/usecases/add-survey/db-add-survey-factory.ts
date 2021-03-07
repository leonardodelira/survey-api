import { IAddSurvey } from '../../../../domain/usecases/add-survey';
import { DbAddSurvey } from '../../../../data/usercases/add-survey/db-add-survey';
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbAddSurvey = (): IAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
