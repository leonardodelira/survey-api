import { IAddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { MongoHelper } from '../helpers/mongo-helper';
import { ILoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { IUpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { ILoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { IAccountModel } from '@/domain/models/account';

export class AccountMongoRepository implements IAddAccountRepository, ILoadAccountByEmailRepository, IUpdateAccessTokenRepository, ILoadAccountByTokenRepository {
  async add(accountData: IAddAccountRepository.Params): Promise<IAddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    return MongoHelper.map(result.ops[0]);
  }

  async loadByEmail(email: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });

    if (!account) return null;

    return MongoHelper.map(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          accessToken: token,
        },
      }
    );
  }

  async loadByToken(token: string, role?: string): Promise<ILoadAccountByTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [
        {
          role,
        },
        {
          role: 'admin',
        },
      ],
    });

    if (!account) return null;

    return MongoHelper.map(account);
  }
}
