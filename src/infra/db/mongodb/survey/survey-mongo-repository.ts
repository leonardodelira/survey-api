import { IAddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { ILoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { ILoadSurveyRepository } from '@/data/protocols/db/survey/load-survey-repository';
import { ISurveyModel } from '@/domain/models/survey';
import { MongoHelper, QueryBuilder } from '../helpers';
import { ObjectId } from 'mongodb';

export class SurveyMongoRepository implements IAddSurveyRepository, ILoadSurveyRepository, ILoadSurveyByIdRepository {
  async add(survey: IAddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(survey);
  }

  async loadAll(accountId: string): Promise<ILoadSurveyRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result',
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', new ObjectId(accountId)],
                  },
                },
              },
            },
            1,
          ],
        },
      })
      .build();

    const surveys: ISurveyModel[] = await surveyCollection.aggregate(query).toArray();
    return surveys && MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<ILoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey: ISurveyModel = await surveyCollection.findOne({ _id: new ObjectId(id) });
    return survey && MongoHelper.map(survey);
  }
}
