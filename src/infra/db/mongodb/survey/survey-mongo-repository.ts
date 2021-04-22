import { IAddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { ILoadSurveyByIdRepository } from '../../../../data/protocols/db/survey/load-survey-by-id-repository';
import { ILoadSurveyRepository } from '../../../../data/protocols/db/survey/load-survey-repository';
import { ISurveyModel } from '../../../../domain/models/survey';
import { IAddSurveyModel } from '../../../../domain/usecases/add-survey';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository implements IAddSurveyRepository, ILoadSurveyRepository, ILoadSurveyByIdRepository {
  async add(survey: IAddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(survey);
  }

  async loadAll(): Promise<ISurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys: ISurveyModel[] = await surveyCollection.find().toArray()
    return surveys && MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<ISurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey: ISurveyModel = await surveyCollection.findOne({ _id: id });
    return survey && MongoHelper.map(survey);
  }
}