import { IAddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { IAccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { IUpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';

export class AccountMongoRepository implements IAddAccountRepository, ILoadAccountByEmailRepository, IUpdateAccessTokenRepository {
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
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

  async updateAccessToken(id: number, token: string): Promise<void> {
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
}
