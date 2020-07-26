import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';
import { Collection } from 'mongodb';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  test('Should return an account on add success', async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email');
    expect(account.password).toBe('any_password');
  });

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut();
    await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });
    const account = await sut.loadByEmail('any_email');
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email');
    expect(account.password).toBe('any_password');
  });

  test('Should return null if account not exists', async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail('any_email');
    expect(account).toBe(null);
  });

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut();
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });
    expect(res.ops[0].accessToken).toBeFalsy();
    await sut.updateAccessToken(res.ops[0]._id, 'any_token');
    const account = await accountCollection.findOne({ _id: res.ops[0]._id });
    expect(account).toBeTruthy();
    expect(account.accessToken).toBe('any_token');
  });
});
