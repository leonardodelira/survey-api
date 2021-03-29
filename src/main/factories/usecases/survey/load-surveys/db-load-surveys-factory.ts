import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository';
import { ILoadSurveys } from '../../../../../domain/usecases/load-surveys';
import DbLoadSurveys from '../../../../../data/usercases/load-surveys/db-load-surveys';

export const makeDbLoadSurveys = (): ILoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
