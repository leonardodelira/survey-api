import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';
import { SurveyMongoRepository } from './survey-mongo-repository';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  });

  return res.ops[0]._id;
};

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe('Survey Mongo Repository', () => {
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

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut();
      await sut.add({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
          {
            answer: 'any_answer',
          },
        ],
        date: new Date(),
      });
      const survey = await surveyCollection.findOne({ question: 'any_question' });
      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const accountId = await makeAccountId();
      const result = await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [{ answer: 'any_answer' }],
          date: new Date(),
        },
        {
          question: 'other_question',
          answers: [{ answer: 'other_answer' }],
          date: new Date(),
        },
      ]);
      const survey = result.ops[0];
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);
      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toEqual('any_question');
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].question).toEqual('other_question');
      expect(surveys[1].didAnswer).toBe(false);
    });

    test('Should load empty list', async () => {
      const accountId = await makeAccountId();
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);
      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{ answer: 'any_answer' }],
        date: new Date(),
      });
      const id = res.ops[0]._id;
      const sut = makeSut();
      const survey = await sut.loadById(id);
      expect(survey).toBeTruthy();
      expect(survey.question).toEqual('any_question');
      expect(survey.id).toBeTruthy();
    });
  });
});
