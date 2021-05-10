import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';
import DbLoadSurveys from '@/data/usercases/survey/load-surveys/db-load-surveys';
import { ILoadSurveys } from '@/domain/usecases/survey/load-surveys';

export const makeDbLoadSurveys = (): ILoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
