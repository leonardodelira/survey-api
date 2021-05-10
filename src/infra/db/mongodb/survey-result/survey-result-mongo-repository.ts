import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { ISurveyResultModel } from '@/domain/models/survey-result';
import { ISaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyResultMongoRepository implements ISaveSurveyResultRepository {
  async save(survey: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    const res = await surveyResultCollection
      .findOneAndUpdate(
        {
          surveyId: survey.surveyId,
          accountId: survey.accountId
        },
        {
          $set: {
            answer: survey.answer,
            date: survey.date
          }
        },
        {
          upsert: true,
          returnOriginal: false,
        });

    return res.value && MongoHelper.map(res.value);
  }
}