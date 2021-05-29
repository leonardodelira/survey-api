import request from 'supertest';
import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccesssToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Leonardo',
    email: 'leonardo.lira@hotmail.com',
    password: '123',
  });

  const id = res.ops[0]._id;
  const accessToken = sign({ id }, env.jwt);
  await accountCollection.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        accessToken,
      },
    }
  );

  return accessToken;
};

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer',
        })
        .expect(403);
    });

    test('Should return 200 on save survey result with accessToken', async () => {
      const accessToken = await makeAccesssToken();
      const res = await surveyCollection.insertOne({
        question: 'Question 1',
        answers: [
          {
            answer: 'any_answer',
            image: 'http://image-name.com',
          },
        ],
        date: new Date(),
      });
      const id = res.ops[0]._id;
      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer',
        })
        .expect(200);
    });
  });

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () => {
      await request(app).get('/api/surveys/any_id/results').expect(403);
    });
  });
});
