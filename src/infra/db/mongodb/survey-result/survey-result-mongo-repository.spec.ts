import { MongoHelper } from '../helpers/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { ISurveyModel } from '@/domain/models/survey';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

const makeSurvey = async (): Promise<ISurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer_1',
      },
      {
        answer: 'any_answer_2',
      },
      {
        answer: 'any_answer_3',
      },
    ],
    date: new Date(),
  });

  return MongoHelper.map(res.ops[0]);
};

const makeAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  });

  return res.ops[0]._id;
};

describe('Survey Mongo Result Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});

    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeSurvey();
      const accountId = await makeAccountId();
      const sut = makeSut();
      await sut.save({
        surveyId: survey.id,
        accountId: accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const res = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: accountId,
      });
      expect(res).toBeTruthy();
    });

    test('Should update a survey result if its already exists', async () => {
      const survey = await makeSurvey();
      const accountId = await makeAccountId();
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const sut = makeSut();
      await sut.save({
        surveyId: survey.id,
        accountId: accountId,
        answer: survey.answers[1].answer,
        date: new Date(),
      });
      const res = await surveyResultCollection
        .find({
          surveyId: survey.id,
          accountId: accountId,
        })
        .toArray();
      expect(res).toBeTruthy();
      expect(res.length).toBe(1);
    });
  });

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const survey = await makeSurvey();
      const accountId = await makeAccountId();
      const accountId2 = await makeAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
      ]);

      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(100);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBeTruthy();
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
    });
  });

  test('Should load survey result', async () => {
    const survey = await makeSurvey();
    const accountId = await makeAccountId();
    const sut = makeSut();
    const surveyResult = await sut.loadBySurveyId(survey.id, accountId);
    expect(surveyResult).toBeNull();
  });
});
